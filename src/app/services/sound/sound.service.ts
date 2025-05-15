import { Injectable } from '@angular/core';
import { Howl } from 'howler';

import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { AuthService } from '../auth/auth.service';
import { ISoundConfig } from '../../shared/interfaces/settings/sound-settings';
import { SoundKeys } from '../../shared/enums/sound-keys';
import { HttpClientService } from '../http-client/http-client.service';
import { OrderBy } from '../../shared/enums/order-by';
import { IAssetsResource } from '../../shared/interfaces/settings/assets-resource';
import { ForceTestData } from '../../shared/classes/force-test-data';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private sounds: { [key: string]: Howl } = {};
  private config: { [key: string]: ISoundConfig } = {};
  private audioUnlocked = false;

  constructor(
    private odooService: OdooService,
    private httpClientService: HttpClientService,
    private authService: AuthService,
  ) {
    this.unlockAudioOnFirstGesture();
  }

  /**
   * Preload sound music on user config
   */
  public async loadUserSounds(): Promise<void> {
    this.config = await this.loadSoundConfig();
    for (const [name, soundConfig] of Object.entries(this.config)) {
      if (soundConfig.resource_url) {
        this.sounds[name] = new Howl({
          src: [soundConfig.resource_url],
          volume: soundConfig.volume || 0.5,
          loop: name === SoundKeys.BACKGROUND,
          preload: true,
          // html5: true,
        });
      }
    }
  }

  /**
   * Play background music
   */
  public playBackground(): void {
    this.playEffect(SoundKeys.BACKGROUND);
  }

  /**
   * Stop background music
   */
  public stopBackground(): void {
    this.stopEffect(SoundKeys.BACKGROUND);
  }

  /**
   * Play music by name
   */
  public playEffect(name: string): void {
    const sound = this.sounds[name];
    if (!sound) {
      console.warn(`[SoundService] Sound effect "${name}" not found`);
      return;
    }

    if (!this.audioUnlocked && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume().then(() => {
        this.audioUnlocked = true;
        sound.play();
      });
    } else {
      sound.play();
    }
  }

  /**
   * Stop music by name
   */
  public stopEffect(name: string): void {
    const sound = this.sounds[name];
    if (sound) {
      sound.stop();
    } else {
      console.warn(`Sound effect "${name}" not found`);
    }
  }

  /**
   * Set volume music by name
   */
  public setVolume(name: string, volume: number): void {
    const sound = this.sounds[name];
    if (sound) {
      sound.volume(volume);
    }

    if (this.config[name]) {
      this.config[name].volume = volume;
    }
  }

  /**
   * Get volume music by name
   */
  public getVolume(name: string): number {
    return this.config[name]?.volume ?? 1;
  }

  /**
   * Load sound list from server
   */
  public async getSoundList(
    searchDomain: SearchDomain = [],
    offset: number = 0,
    limit: number = 20,
    order?: OrderBy
  ): Promise<Array<IAssetsResource>> {
    // TODO: Call API to load new audio list
    // Download and cache index source uri
    return ForceTestData.background_sounds;
  }

  /**
   * Load user sound config
   * @private
   */
  private async loadSoundConfig(): Promise<{ [key: string]: ISoundConfig }> {
    const soundSettings = await this.authService.getSoundSettings();
    if (!soundSettings) return {};

    const results: { [key: string]: ISoundConfig } = {};
    for (const key in soundSettings) {
      const value = soundSettings[key].sound;
      if (!value) continue;
      value.volume = soundSettings[key].volume;
      results[key] = value;
    }

    return results;
  }

  /**
   * Đảm bảo AudioContext được khởi động sau tương tác người dùng
   */
  private unlockAudioOnFirstGesture(): void {
    const resumeAudio = () => {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume().then(() => {
          this.audioUnlocked = true;
          console.log('[SoundService] AudioContext resumed!');
        });
      }
      document.body.removeEventListener('click', resumeAudio);
      document.body.removeEventListener('touchstart', resumeAudio);
      document.body.removeEventListener('keydown', resumeAudio);
    };

    document.body.addEventListener('click', resumeAudio, {once: true});
    document.body.addEventListener('touchstart', resumeAudio, {once: true});
    document.body.addEventListener('keydown', resumeAudio, {once: true});
  }
}
