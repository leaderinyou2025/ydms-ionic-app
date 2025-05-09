import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { TranslateService } from '@ngx-translate/core';

import { AppLockService } from '../../../services/app-lock/app-lock.service';
import { TranslateKeys } from '../../enums/translate-keys';

@Component({
  selector: 'app-pin-verify-modal',
  templateUrl: './pin-verify-modal.component.html',
  styleUrls: ['./pin-verify-modal.component.scss'],
  standalone: false
})
export class PinVerifyModalComponent  {
  @Input() title: string;
  protected readonly TranslateKeys = TranslateKeys;

  pin: string = '';
  maxLength = 4;
  dots = new Array(this.maxLength);
  numberPad = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  isError = false;

  constructor(
    private modalCtrl: ModalController,
    private appLockService: AppLockService,
    private translate: TranslateService
  ) {
    this.title = this.translate.instant(TranslateKeys.TITLE_ENTER_CURRENT_PIN);
  }

  /**
   * Handle input digit
   * @param digit
   */
  public async inputDigit(digit: string): Promise<void> {
    if (this.pin.length >= this.maxLength) return;
    this.pin += digit;

    if (this.pin.length === this.maxLength) {
      await this.verifyPin();
    }
  }

  /**
   * Handle click remove button
   */
  public removeDigit(): void {
    if (this.pin.length > 0) {
      this.pin = this.pin.slice(0, -1);
    }
  }

  /**
   * Cancel verification
   */
  public cancel(): void {
    this.modalCtrl.dismiss({verified: false});
  }

  /**
   * Verify entered PIN
   */
  private async verifyPin(): Promise<void> {
    const isValid = await this.appLockService.verifyPin(this.pin);

    if (isValid) {
      // PIN is correct, dismiss modal with success
      this.modalCtrl.dismiss({verified: true});
    } else {
      this.isError = true;
      Haptics.impact({style: ImpactStyle.Heavy});

      // Reset PIN
      setTimeout(() => {
        this.isError = false;
        this.pin = '';
      }, 500);
    }
  }
}
