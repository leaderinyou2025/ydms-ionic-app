import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { AuthService } from '../auth/auth.service';
import { ISoundConfig } from '../../shared/interfaces/settings/sound-settings';
import { SoundKeys } from '../../shared/enums/sound-keys';
import { CommonConstants } from '../../shared/classes/common-constants';
import { IAssetsResource } from '../../shared/interfaces/settings/assets-resource';
import { AssetResourceCategory } from '../../shared/enums/asset-resource-category';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private sounds: { [key: string]: Howl } = {};
  private config: { [key: string]: ISoundConfig } = {};
  private audioUnlocked = false;

  constructor(
    private authService: AuthService,
  ) {
    this.unlockAudioOnFirstGesture();
  }

  /**
   * Set background sound
   * @param sound
   */
  public setBackgroundSound(sound: Howl) {
    if (!sound) return;
    this.sounds[SoundKeys.BACKGROUND] = sound;
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
        });
      }
    }
  }

  /**
   * Play background music
   */
  public playBackground(): void {
    this.authService.getSoundSettings().then(settings => {
      if (settings?.background?.enabled && settings?.background?.sound?.resource_url) {
        this.playEffect(SoundKeys.BACKGROUND);
      }
    });
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
  public playEffect(name: SoundKeys): void {
    this.authService.getSoundSettings().then(settings => {
      if (settings?.enabled) {
        const sound = this.sounds[name];
        if (!sound) {
          console.warn(`[SoundService] Sound effect "${name}" not found`);
          return;
        }

        // Stop if sound is playing
        sound.stop();

        if (!this.audioUnlocked && Howler.ctx.state === 'suspended') {
          Howler.ctx.resume().then(() => {
            this.audioUnlocked = true;
            sound.play();
          });
        } else {
          sound.play();
        }
      }
    });
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
   * Đảm bảo AudioContext được khởi động sau tương tác người dùng
   */
  public unlockAudioOnFirstGesture(): void {
    const resumeAudio = () => {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume().then(() => {
          this.audioUnlocked = true;
          this.playBackground();
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

  /**
   * Get list background sound
   */
  public getBackgroundSoundGallery(): Array<IAssetsResource> {
    return CommonConstants.sound_gallery.filter(u => u['category'] === AssetResourceCategory.BACKGROUND);
  }

  /**
   * Load user sound config
   * @private
   */
  private async loadSoundConfig(): Promise<{ [key: string]: ISoundConfig }> {
    const results: { [key: string]: ISoundConfig } = {};
    for (const sound of CommonConstants.sound_gallery) {
      const key: string = sound['key'];
      if (!key) continue;
      results[key] = {id: sound.id, name: sound.name, resource_url: sound.resource_url, volume: 1};
    }

    const soundSettings = await this.authService.getSoundSettings();
    if (!soundSettings) return results;

    // Load background sound
    if (soundSettings.background?.sound) {
      results[SoundKeys.BACKGROUND] = {
        id: soundSettings.background.sound.id,
        name: soundSettings.background.sound.name,
        resource_url: soundSettings.background.sound.resource_url,
        volume: soundSettings.background.volume,
      }
    }

    return results;
  }
}
