import { Component, OnDestroy, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';

import { SoundService } from './services/sound/sound.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { AppLockService } from './services/app-lock/app-lock.service';
import { StateService } from './services/state/state.service';
import { CommonConstants } from './shared/classes/common-constants';
import { StorageKey } from './shared/enums/storage-key';
import { LanguageKeys } from './shared/enums/language-keys';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  showLockScreen = false;
  private showLockScreenSubscribe: any;

  constructor(
    private soundService: SoundService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private appLockService: AppLockService,
    private stateService: StateService,
  ) {
  }

  ngOnInit() {
    // Load device ID
    Device.getId().then(deviceId => CommonConstants.deviceId = deviceId.identifier);
    // Init checking app lock
    this.checkLock();
    // Initial translation
    this.initializeTranslation();
    // Preload sounds
    this.loadingSounds();
  }

  ngOnDestroy() {
    this.showLockScreenSubscribe?.unsubscribe();
  }

  /**
   * Check lock app
   */
  private checkLock() {
    this.appLockService.monitorAppState();
    this.appLockService.shouldLockAtStartup().then(showLockScreen => this.showLockScreen = showLockScreen);

    // On lock screen state change from monitorAppState function of AppLockService
    this.showLockScreenSubscribe = this.stateService.showLockScreen$.subscribe((showLockScreen) => {
      this.showLockScreen = showLockScreen;
    });
  }

  /**
   * Init translation
   * @private
   */
  private initializeTranslation(): void {
    const defaultLanguage = this.localStorageService.get<string>(StorageKey.LANGUAGE) || LanguageKeys.VN;
    this.localStorageService.set(StorageKey.LANGUAGE, defaultLanguage);
    if (this.translate.getLangs()?.length) return;
    this.translate.addLangs([LanguageKeys.EN, LanguageKeys.VN]);
    this.translate.resetLang(defaultLanguage);
    this.translate.use(defaultLanguage);
  }

  /**
   * Loading sound
   * @private
   */
  private loadingSounds(): void {
    this.soundService.loadBackgroundSounds();
    this.soundService.loadUserSounds();
  }
}
