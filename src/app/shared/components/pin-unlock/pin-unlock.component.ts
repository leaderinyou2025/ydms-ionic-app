import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AvailableResult } from 'capacitor-native-biometric';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { AppLockService } from '../../../services/app-lock/app-lock.service';
import { StateService } from '../../../services/state/state.service';
import { BiometricService } from '../../../services/biometric/biometric.service';
import { PageRoutes } from '../../enums/page-routes';
import { TranslateKeys } from '../../enums/translate-keys';

@Component({
  selector: 'app-pin-unlock',
  templateUrl: './pin-unlock.component.html',
  styleUrls: ['./pin-unlock.component.scss'],
  standalone: false
})
export class PinUnlockComponent implements OnInit {
  pin: string = '';
  maxLength = 4;
  dots = new Array(this.maxLength);
  numberPad = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  biometricAvailable!: AvailableResult | undefined;
  enableBiometric!: boolean;
  isFaceID!: boolean;
  isError = false;
  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private navCtrl: NavController,
    private appLockService: AppLockService,
    private stateService: StateService,
    private biometricService: BiometricService,
  ) {
    this.biometricAvailable = this.biometricService.getAvailableResult();
    this.isFaceID = this.biometricService.isFaceId();
  }

  async ngOnInit(): Promise<void> {
    this.enableBiometric = this.appLockService.getSettingAppUnlockBiometricStatus();
    if (this.biometricAvailable?.isAvailable && this.enableBiometric) {
      setTimeout(() => this.useBiometric(), 500);
    }
  }

  /**
   * Handle input and verify PIN
   * @param digit
   */
  public async inputDigit(digit: string): Promise<void> {
    if (this.pin.length >= this.maxLength) return;
    this.pin += digit;

    if (this.pin.length !== this.maxLength) return;

    const valid = await this.appLockService.verifyPin(this.pin);
    if (valid) {
      this.stateService.setShowLockScreen(false);
      await this.navCtrl.navigateRoot(`/${PageRoutes.HOME}`, {replaceUrl: true});
      return;
    }

    this.isError = true;
    Haptics.impact({style: ImpactStyle.Heavy});
    setTimeout(() => {
      this.isError = false;
      this.pin = '';
    }, 400);
  }

  /**
   * Handle click remove button
   */
  public removeDigit() {
    if (this.pin.length > 0) {
      this.pin = this.pin.slice(0, -1);
    }
  }

  /**
   * Handle unlock by biometric button
   */
  public async useBiometric() {
    const unlocked = await this.appLockService.unlockAppByBiometric();
    if (unlocked) this.stateService.setShowLockScreen(false);
  }
}
