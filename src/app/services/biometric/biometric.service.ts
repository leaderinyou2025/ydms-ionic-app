import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AvailableResult, BiometryType, Credentials, NativeBiometric } from 'capacitor-native-biometric';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { StateService } from '../state/state.service';
import { StorageKey } from '../../shared/enums/storage-key';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { NativePlatform } from '../../shared/enums/native-platform';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BiometricService {

  constructor(
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private platform: Platform,
    private stateService: StateService,
  ) {
  }

  /**
   * Check biometric is available on native device
   */
  public checkAvailable(): void {
    if (!this.platform.is(NativePlatform.MOBILEWEB) &&
      (this.platform.is(NativePlatform.ANDROID) || this.platform.is(NativePlatform.IOS))) {
      NativeBiometric.isAvailable()
        .then(result => this.localStorageService.set(StorageKey.BIOMETRIC_AVAILABLE_RESULT, result))
        .catch(e => console.error(e));
    }
  }

  /**
   * Return setting biometric status on localStorage
   */
  public getBiometricSettingStatus(): boolean {
    return this.localStorageService.get(StorageKey.ENABLE_BIOMETRIC) || false;
  }

  /**
   * Save ometric status on localStorage
   * @param status
   */
  public setBiometricSettingStatus(status: boolean): void {
    this.localStorageService.set<boolean>(StorageKey.ENABLE_BIOMETRIC, status);
  }

  /**
   * Return biometric available result on localStorage
   */
  public getAvailableResult(): AvailableResult | undefined {
    return this.localStorageService.get<AvailableResult>(StorageKey.BIOMETRIC_AVAILABLE_RESULT);
  }

  /**
   * Check biometric type is face id
   */
  public isFaceId(): boolean {
    const storage = this.getAvailableResult();
    return storage?.biometryType === BiometryType.FACE_ID;
  }

  /**
   * getCertificates
   * @param username
   */
  public async getCredentials(username: string): Promise<Credentials | undefined> {
    if (!this.platform.is(NativePlatform.MOBILEWEB) &&
      (this.platform.is(NativePlatform.ANDROID) || this.platform.is(NativePlatform.IOS))) {
      const serverUser = `${environment.serverUrl}/${username}`;
      const available = await NativeBiometric.isAvailable();
      if (!available?.isAvailable) return;
      return NativeBiometric.getCredentials({server: serverUser});
    } else {
      return;
    }
  }

  /**
   * setCredentials
   * @param credential
   */
  public async setCredentials(credential: Credentials): Promise<void> {
    if (!credential?.username?.length || !credential.password?.length) return;
    const serverUser = `${environment.serverUrl}/${credential.username}`;
    if (!this.platform.is(NativePlatform.MOBILEWEB) &&
      (this.platform.is(NativePlatform.ANDROID) || this.platform.is(NativePlatform.IOS))) {
      await NativeBiometric.setCredentials({server: serverUser, username: credential.username, password: credential.password}).then(() => {
        console.log('Credentials set successfully');
      }).catch(e => console.error(JSON.stringify(e)));
    }
  }

  /**
   * deleteCredentials
   * @param username
   */
  public async deleteCredentials(username: string): Promise<void> {
    if (!this.platform.is(NativePlatform.MOBILEWEB) &&
      (this.platform.is(NativePlatform.ANDROID) || this.platform.is(NativePlatform.IOS))) {
      const serverUser = `${environment.serverUrl}/${username}`;
      await NativeBiometric.deleteCredentials({server: serverUser});
    }
  }

  /**
   * Verify biometric
   */
  public async verifyIdentity(): Promise<boolean> {
    if (!this.platform.is(NativePlatform.MOBILEWEB) &&
      (this.platform.is(NativePlatform.ANDROID) || this.platform.is(NativePlatform.IOS))) {
      return NativeBiometric.verifyIdentity({
        title: this.translate.instant(TranslateKeys.TITLE_AUTH_BIOMETRIC_UNLOCK_APP),
        negativeButtonText: this.translate.instant(TranslateKeys.BUTTON_CANCEL),
        maxAttempts: 5
      }).then(() => {
        return true;
      }).catch((e) => {
        console.error(e?.message);
        return false;
      }).finally(() => this.stateService.verifyByBiometric());
    } else {
      return false;
    }
  }
}
