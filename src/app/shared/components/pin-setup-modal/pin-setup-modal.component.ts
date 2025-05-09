import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { TranslateService } from '@ngx-translate/core';

import { TranslateKeys } from '../../enums/translate-keys';

@Component({
  selector: 'app-pin-setup-modal',
  templateUrl: './pin-setup-modal.component.html',
  styleUrls: ['./pin-setup-modal.component.scss'],
  standalone: false
})
export class PinSetupModalComponent  {
  @Input() title: string;
  @Input() confirmTitle: string;
  protected readonly TranslateKeys = TranslateKeys;

  pin: string = '';
  confirmPin: string = '';
  maxLength = 4;
  dots = new Array(this.maxLength);
  numberPad = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  isConfirmStep = false;
  isError = false;

  constructor(
    private modalCtrl: ModalController,
    private translate: TranslateService
  ) {
    this.title = this.translate.instant(TranslateKeys.TITLE_ENTER_NEW_PIN);
    this.confirmTitle = this.translate.instant(TranslateKeys.TITLE_CONFIRM_NEW_PIN);
  }


  /**
   * Handle input digit
   * @param digit
   */
  public inputDigit(digit: string): void {
    if (this.isConfirmStep) {
      if (this.confirmPin.length >= this.maxLength) return;
      this.confirmPin += digit;

      if (this.confirmPin.length === this.maxLength) {
        this.verifyPins();
      }
    } else {
      if (this.pin.length >= this.maxLength) return;
      this.pin += digit;

      if (this.pin.length === this.maxLength) {
        // Move to confirm step
        this.isConfirmStep = true;
      }
    }
  }

  /**
   * Handle click remove button
   */
  public removeDigit(): void {
    if (!this.confirmPin?.length) return;
    if (this.isConfirmStep) this.confirmPin = this.confirmPin.slice(0, -1);
    else this.pin = this.pin.slice(0, -1);
  }

  /**
   * Verify that both PINs match
   */
  private verifyPins(): void {
    if (this.pin === this.confirmPin) {
      // PINs match, dismiss modal with success
      this.modalCtrl.dismiss({pin: this.pin});
    } else {
      // PINs don't match, show error
      this.isError = true;
      Haptics.impact({style: ImpactStyle.Heavy});

      // Reset confirm PIN
      setTimeout(() => {
        this.isError = false;
        this.confirmPin = '';
      }, 500);
    }
  }

  /**
   * Cancel setup
   */
  public cancel(): void {
    this.modalCtrl.dismiss();
  }
}
