import { Component, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AppLockService } from '../../../../../services/app-lock/app-lock.service';
import { LocalStorageService } from '../../../../../services/local-storage/local-storage.service';
import { PageRoutes } from '../../../../../shared/enums/page-routes';
import { TranslateKeys } from '../../../../../shared/enums/translate-keys';
import { StorageKey } from '../../../../../shared/enums/storage-key';
import { PinSetupModalComponent } from '../../../../../shared/components/pin-setup-modal/pin-setup-modal.component';
import { PinVerifyModalComponent } from '../../../../../shared/components/pin-verify-modal/pin-verify-modal.component';
import { StyleClass } from '../../../../../shared/enums/style-class';
import { BtnRoles } from '../../../../../shared/enums/btn-roles';

@Component({
  selector: 'app-app-lock-settings',
  templateUrl: './app-lock-settings.component.html',
  styleUrls: ['./app-lock-settings.component.scss'],
  standalone: false
})
export class AppLockSettingsComponent implements OnInit {
  isAppLockEnabled = false;
  isBiometricEnabled = false;
  autoLockTimeout = 0;
  autoLockLabel = '';

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private router: Router,
    private appLockService: AppLockService,
    private localStorageService: LocalStorageService,
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loadSettings();
  }

  /**
   * Load current app lock settings
   */
  private loadSettings() {
    // Đọc giá trị từ localStorage
    const appLockEnabled = this.localStorageService.get<boolean>(StorageKey.APP_LOCK_ENABLE);
    const biometricEnabled = this.localStorageService.get<boolean>(StorageKey.APP_UNLOCK_BIOMETRIC_ENABLE);
    const autoLockTimeout = this.localStorageService.get<number>(StorageKey.APP_LOCK_TIMEOUT);

    // Chuyển đổi giá trị số thành boolean
    this.isAppLockEnabled = appLockEnabled === true;
    this.isBiometricEnabled = biometricEnabled === true;
    this.autoLockTimeout = autoLockTimeout || 0;
    this.updateAutoLockLabel();
  }

  /**
   * Update auto-lock label based on current timeout
   */
  private updateAutoLockLabel() {
    switch (this.autoLockTimeout) {
      case 0:
        this.autoLockLabel = this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_IMMEDIATELY);
        break;
      case 30:
        this.autoLockLabel = this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_30_SECONDS);
        break;
      case 60:
        this.autoLockLabel = this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_1_MINUTE);
        break;
      case 300:
        this.autoLockLabel = this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_5_MINUTES);
        break;
      case 900:
        this.autoLockLabel = this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_15_MINUTES);
        break;
      case 1800:
        this.autoLockLabel = this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_30_MINUTES);
        break;
      default:
        this.autoLockLabel = this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_IMMEDIATELY);
    }
  }

  /**
   * Toggle app lock
   */
  async toggleAppLock(event: any) {
    const isEnabled = event.detail.checked;

    if (isEnabled) {
      // Enable app lock - need to set up PIN
      const modal = await this.modalCtrl.create({
        component: PinSetupModalComponent,
        cssClass: 'fullscreen-modal',
        backdropDismiss: false
      });

      await modal.present();
      const { data } = await modal.onDidDismiss();

      if (data?.pin) {
        // Save the PIN and enable app lock
        await this.appLockService.setPin(data.pin);
        this.localStorageService.set(StorageKey.APP_LOCK_ENABLE, true);
        this.isAppLockEnabled = true;
      } else {
        // User cancelled, revert toggle
        this.isAppLockEnabled = false;
        event.target.checked = false;
      }
    } else {
      // Disable app lock - need to verify current PIN
      const modal = await this.modalCtrl.create({
        component: PinVerifyModalComponent,
        cssClass: 'fullscreen-modal'
      });

      await modal.present();
      const { data } = await modal.onDidDismiss();

      if (data?.verified) {
        this.localStorageService.remove(StorageKey.APP_LOCK_ENABLE);
        this.localStorageService.remove(StorageKey.APP_UNLOCK_BIOMETRIC_ENABLE);
        this.isAppLockEnabled = false;
        this.isBiometricEnabled = false;
      } else {
        // Verification failed or cancelled, revert toggle
        this.isAppLockEnabled = true;
        event.target.checked = true;
      }
    }
  }

  /**
   * Toggle biometric unlock
   */
  toggleBiometricUnlock(event: any) {
    const isEnabled = event.detail.checked;
    if (isEnabled) {
      this.localStorageService.set(StorageKey.APP_UNLOCK_BIOMETRIC_ENABLE, true);
    } else {
      this.localStorageService.remove(StorageKey.APP_UNLOCK_BIOMETRIC_ENABLE);
    }
    this.isBiometricEnabled = isEnabled;
  }

  /**
   * Open change PIN screen
   */
  async openChangePIN() {
    if (!this.isAppLockEnabled) {
      return;
    }

    // First verify current PIN
    const verifyModal = await this.modalCtrl.create({
      component: PinVerifyModalComponent,
      cssClass: 'fullscreen-modal'
    });

    await verifyModal.present();
    const verifyResult = await verifyModal.onDidDismiss();

    if (verifyResult.data?.verified) {
      // Current PIN verified, now set new PIN
      const setupModal = await this.modalCtrl.create({
        component: PinSetupModalComponent,
        cssClass: 'fullscreen-modal',
        componentProps: {
          title: this.translate.instant(TranslateKeys.TITLE_ENTER_NEW_PIN),
          confirmTitle: this.translate.instant(TranslateKeys.TITLE_CONFIRM_NEW_PIN)
        }
      });

      await setupModal.present();
      const setupResult = await setupModal.onDidDismiss();

      if (setupResult.data?.pin) {
        // Save the new PIN
        await this.appLockService.setPin(setupResult.data.pin);
      }
    }
  }

  /**
   * Open auto-lock settings
   */
  async openAutoLockSettings() {
    if (!this.isAppLockEnabled) {
      return;
    }

    const buttons: Array<ActionSheetButton> = [
      {
        text: this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_IMMEDIATELY),
        cssClass: this.autoLockTimeout === 0 ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.autoLockTimeout = 0;
          this.localStorageService.remove(StorageKey.APP_LOCK_TIMEOUT);
          this.updateAutoLockLabel();
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_30_SECONDS),
        cssClass: this.autoLockTimeout === 30 ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.autoLockTimeout = 30;
          this.localStorageService.set(StorageKey.APP_LOCK_TIMEOUT, 30);
          this.updateAutoLockLabel();
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_1_MINUTE),
        cssClass: this.autoLockTimeout === 60 ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.autoLockTimeout = 60;
          this.localStorageService.set(StorageKey.APP_LOCK_TIMEOUT, 60);
          this.updateAutoLockLabel();
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_5_MINUTES),
        cssClass: this.autoLockTimeout === 300 ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.autoLockTimeout = 300;
          this.localStorageService.set(StorageKey.APP_LOCK_TIMEOUT, 300);
          this.updateAutoLockLabel();
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_15_MINUTES),
        cssClass: this.autoLockTimeout === 900 ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.autoLockTimeout = 900;
          this.localStorageService.set(StorageKey.APP_LOCK_TIMEOUT, 900);
          this.updateAutoLockLabel();
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_30_MINUTES),
        cssClass: this.autoLockTimeout === 1800 ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.autoLockTimeout = 1800;
          this.localStorageService.set(StorageKey.APP_LOCK_TIMEOUT, 1800);
          this.updateAutoLockLabel();
        },
      },
      {
        text: this.translate.instant(TranslateKeys.BUTTON_CANCEL),
        role: BtnRoles.CANCEL,
      },
    ];

    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant(TranslateKeys.TITLE_AUTO_LOCK_APP),
      buttons: buttons,
      cssClass: 'theme-action-sheet'
    });

    await actionSheet.present();
  }

}
