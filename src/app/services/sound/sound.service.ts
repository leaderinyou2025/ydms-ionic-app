import { Injectable } from '@angular/core';
import { Howl } from 'howler';

import { OdooService } from '../odoo/odoo.service';
import { ISoundConfig } from '../../shared/interfaces/sound/sound-config';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private sounds: { [key: string]: Howl } = {};
  private bgMusic?: Howl;
  private config: { [key: string]: ISoundConfig } = {};

  constructor(
    private odooService: OdooService,
  ) {
  }

  async loadUserSounds(): Promise<void> {
    this.config = await this.loadSoundConfig();
    for (const [name, {url, volume}] of Object.entries(this.config)) {
      this.sounds[name] = new Howl({
        src: [url],
        volume: volume,
        preload: true
      });
    }
  }

  loadBackgroundSounds(): void {
    this.bgMusic = new Howl({
      src: '/assets/sounds/background.mp3',
      loop: true,
      volume: 0.2,
      preload: true
    });
  }

  playEffect(name: string): void {
    const sound = this.sounds[name];
    if (sound) {
      sound.play();
    } else {
      console.warn(`Sound effect "${name}" not found`);
    }
  }

  playBackground(): void {
    if (this.bgMusic && !this.bgMusic.playing()) {
      this.bgMusic.play();
    }
  }

  stopBackground(): void {
    this.bgMusic?.stop();
  }

  setVolume(name: string, volume: number): void {
    const sound = this.sounds[name];
    if (sound) {
      sound.volume(volume);
    }

    if (name === 'background' && this.bgMusic) {
      this.bgMusic.volume(volume);
    }

    if (this.config[name]) {
      this.config[name].volume = volume;
    }
  }

  getVolume(name: string): number {
    return this.config[name]?.volume ?? 1;
  }

  private async loadSoundConfig(): Promise<{ [key: string]: ISoundConfig }> {
    // TODO: Loading sound config of user form server
    return {}
  }
}
