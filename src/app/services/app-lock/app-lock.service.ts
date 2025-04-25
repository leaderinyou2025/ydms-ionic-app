import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { NativeBiometric } from 'capacitor-native-biometric';
import { TranslateService } from '@ngx-translate/core';

import { StorageService } from '../storage/storage.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { StateService } from '../state/state.service';
import { StorageKey } from '../../shared/enums/storage-key';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { NativePlatform } from '../../shared/enums/native-platform';

@Injectable({
  providedIn: 'root'
})
export class AppLockService {
  private locked = false;
  private backgroundTime: number | null = null;
  private skipNextAppResume = false;


  constructor(
    private storageService: StorageService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private platform: Platform,
    private stateService: StateService,
  ) {
    this.stateService.verifyByBiometric$.subscribe(() => this.skipNextAppResume = true);
  }

  /**
   * Kiểm tra khi app khởi động có cần khóa không
   */
  public async shouldLockAtStartup(): Promise<boolean> {
    const enabled = this.localStorageService.get<boolean>(StorageKey.APP_LOCK_ENABLE);
    if (!enabled) return false;

    this.locked = true;
    return true;
  }

  /**
   * Mở khóa ứng dụng: ưu tiên biometric, fallback là PIN
   */
  public async unlockAppByBiometric(): Promise<boolean> {
    const allowBiometric = this.localStorageService.get<boolean>(StorageKey.APP_UNLOCK_BIOMETRIC_ENABLE);
    if (!allowBiometric) {
      return false;
    }

    // Kiểm tra biometric
    this.skipNextAppResume = true;
    return NativeBiometric.verifyIdentity({
      title: this.translate.instant(TranslateKeys.COMMON_AUTH_BIOMETRIC_UNLOCK_APP),
      negativeButtonText: this.translate.instant(TranslateKeys.BUTTON_CANCEL),
      maxAttempts: 5
    }).then(() => {
      this.locked = false;
      return true;
    }).catch((e) => {
      console.error(e?.message);
      return false;
    });
  }

  /**
   * Trạng thái ứng dụng hiện tại có bị khóa không
   */
  public isLocked(): boolean {
    return this.locked;
  }

  /**
   * Kiểm tra mã PIN do người dùng nhập
   * @param pin
   */
  public async verifyPin(pin: string): Promise<boolean> {
    const saved = await this.storageService.get<string>(StorageKey.APP_LOCK_PIN)
    return pin === saved;
  }

  /**
   * Lưu mã PIN mới
   * @param pin
   */
  public async setPin(pin: string) {
    await this.storageService.set(StorageKey.APP_LOCK_PIN, pin);
  }

  /**
   * Theo dõi trạng thái app (foreground/background)
   */
  public monitorAppState() {
    if (this.platform.is(NativePlatform.MOBILEWEB)) {
      return;
    }

    App.addListener('appStateChange', async ({isActive}) => {
      if (!isActive) {
        // Ghi nhận thời gian khi app vào background
        this.backgroundTime = Date.now();
      } else {
        // Khi quay lại foreground → kiểm tra xem có cần khóa không
        const enabled = this.localStorageService.get<boolean>(StorageKey.APP_LOCK_ENABLE);

        if (!enabled || this.skipNextAppResume) {
          this.skipNextAppResume = false;
          return;
        }

        const timeout = this.localStorageService.get<number>(StorageKey.APP_LOCK_TIMEOUT) || 0;
        if (timeout === 0) {
          this.locked = true;
          this.stateService.setShowLockScreen(this.locked);
          return;
        }

        const now = Date.now();
        const elapsed = (now - (this.backgroundTime || 0)) / 1000;
        if (elapsed >= timeout) {
          this.locked = true;
          this.stateService.setShowLockScreen(this.locked);
        }
      }
    });
  }
}
