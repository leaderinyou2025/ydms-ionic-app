import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../services/auth/auth.service';
import { SoundService } from '../../../../services/sound/sound.service';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../shared/enums/page-routes';
import { Theme } from '../../../../shared/enums/theme';
import { ISoundSettings } from '../../../../shared/interfaces/settings/sound-settings';
import { INotificationSettings } from '../../../../shared/interfaces/settings/notification-settings';
import { SoundKeys } from '../../../../shared/enums/sound-keys';

@Component({
  selector: 'app-notification-and-sound',
  templateUrl: './notification-and-sound.component.html',
  styleUrls: ['./notification-and-sound.component.scss'],
  standalone: false
})
export class NotificationAndSoundComponent implements OnInit {

  soundSettings!: ISoundSettings | undefined;
  notificationSettings!: INotificationSettings | undefined;

  private isChangeSettings!: boolean;

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
  protected readonly Theme = Theme;

  constructor(
    public soundService: SoundService,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.loadSoundSettings();
  }

  ionViewDidEnter() {
    this.isChangeSettings = false;
  }

  ionViewWillLeave() {
    if (!this.isChangeSettings) return;
    this.saveUserSettings();
  }

  /**
   * onSwitchNotificationEnable
   * @param event
   */
  public onSwitchNotificationEnable(event: CustomEvent) {
    if (this.notificationSettings) this.notificationSettings.enabled = event.detail.checked;
    this.isChangeSettings = true;
  }

  /**
   * onSwitchBackgroundEnable
   * @param event
   */
  public onSwitchBackgroundEnable(event: CustomEvent) {
    if (this.soundSettings?.background) this.soundSettings.background.enabled = event.detail.checked;
    this.isChangeSettings = true;
  }

  /**
   * onChangeBackgroundVolume
   * @param event
   */
  public onChangeBackgroundVolume(event: CustomEvent) {
    this.soundService.setVolume(SoundKeys.BACKGROUND, event.detail.value);
    this.soundService.playBackground();
    this.isChangeSettings = true;
    if (this.soundSettings?.background) this.soundSettings.background.volume = +event.detail.value;
  }

  /**
   * onSwitchBackgroundMusic
   * @param event
   */
  public onSwitchBackgroundMusic(event: any) {
    // TODO: Show list music and process change
  }

  /**
   * onSwitchEffects
   * @param event
   * @param effectType
   */
  public onSwitchEffects(event: CustomEvent, effectType: SoundKeys) {
    if (!this.soundSettings) return;
    if (!this.soundSettings[effectType]) this.soundSettings[effectType] = {enabled: event.detail.checked};
    else this.soundSettings[effectType].enabled = event.detail.checked;
  }

  /**
   * loadSoundSettings
   */
  private loadSoundSettings() {
    this.authService.getUserSettings().then(userSetting => {
      this.soundSettings = userSetting?.sound;
      this.notificationSettings = userSetting?.notification;
    });
  }

  /**
   * Save sound and notification setting to user
   * @private
   */
  private saveUserSettings() {
    this.authService.getUserSettings().then(userSettings => {
      if (userSettings && this.soundSettings && this.notificationSettings) {
        userSettings.sound = this.soundSettings;
        userSettings.notification = this.notificationSettings;
        this.authService.setUserSettings(userSettings);
      }
    });
  }

  protected readonly SoundKeys = SoundKeys;
}
