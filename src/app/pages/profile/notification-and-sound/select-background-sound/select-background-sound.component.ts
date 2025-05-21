import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../../../../services/auth/auth.service';
import { SoundService } from '../../../../services/sound/sound.service';
import { ISoundResource } from '../../../../shared/interfaces/settings/assets-resource';

@Component({
  selector: 'app-select-background-sound',
  templateUrl: './select-background-sound.component.html',
  styleUrls: ['./select-background-sound.component.scss'],
  standalone: false
})
export class SelectBackgroundSoundComponent implements OnInit {

  @Input() volume!: number;

  backgroundSounds!: Array<ISoundResource>;
  sound: Howl | null = null;
  selectedSound?: ISoundResource;
  playing: boolean = false;

  constructor(
    private soundService: SoundService,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.backgroundSounds = new Array<ISoundResource>();
    this.loadSound();
  }

  ionViewDidEnter() {
    this.soundService.stopBackground();
  }

  ionViewWillLeave() {
    this.stopSound();
    this.soundService.playBackground();
  }

  /**
   * Play sound
   * @param item
   */
  playSound(item: ISoundResource) {
    // Dừng âm thanh hiện tại nếu có
    if (this.sound) {
      this.sound.stop();
      this.playing = false;
      if (this.selectedSound) {
        this.selectedSound.progress = 0;
        this.selectedSound.currentTime = '0:00';
      }
    }

    if (!item.resource_url) return

    // Chọn âm thanh mới
    this.selectedSound = item;
    this.sound = new Howl({
      src: [item.resource_url],
      html5: true,
      onplay: () => {
        this.playing = true;
        item.duration = this.sound!.duration();
        item.durationTime = this.formatTime(item.duration);
        this.updateProgress();
      },
      onend: () => {
        this.playing = false;
        item.progress = 0;
        item.currentTime = '0:00';
      },
    });

    // Phát âm thanh
    this.sound.play();
    this.soundService.setBackgroundSound(this.sound);
    this.setSelectedSound();
  }

  /**
   * Pause sound
   */
  stopSound() {
    if (this.sound) this.sound.stop();
    this.selectedSound = undefined;
    this.playing = false;
  }

  /**
   * Xử lý khi người dùng kéo thanh tiến trình
   * @param event
   * @param item
   */
  public onProgressChange(event: any, item: ISoundResource) {
    if (this.sound && this.selectedSound?.id === item.id) {
      const newValue = event.detail.value;
      this.sound.seek(newValue);
      item.progress = newValue;
      item.currentTime = this.formatTime(newValue);
    }
  }

  /**
   * Cập nhật tiến trình
   * @private
   */
  private updateProgress(): void {
    if (this.sound && this.playing && this.selectedSound) {
      this.selectedSound.progress = this.sound.seek() as number;
      this.selectedSound.currentTime = this.formatTime(this.selectedSound.progress);
      // Cập nhật mỗi 100ms
      setTimeout(() => this.updateProgress(), 100);
    }
  }

  /**
   * Hàm định dạng thời gian (giây -> mm:ss)
   * @param seconds
   * @private
   */
  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  /**
   * loadSound
   * @private
   */
  private loadSound(): void {
    const bgSounds = this.soundService.getBackgroundSoundGallery();
    this.authService.getSoundSettings().then(soundSettings => {
      bgSounds.forEach(item => {
        if (item.resource_url) {
          const tempSound = new Howl({
            src: [item.resource_url],
            html5: true,
          });
          tempSound.once('load', () => {
            const bgSoundItem = {
              id: item.id,
              name: item.name,
              resource_url: item.resource_url,
              progress: 0,
              duration: tempSound.duration(),
              durationTime: this.formatTime(tempSound.duration()),
              currentTime: this.formatTime(0)
            };
            this.backgroundSounds.push(bgSoundItem);
            this.backgroundSounds = this.backgroundSounds.sort((a, b) => a.id - b.id);
            if (soundSettings?.background?.sound?.id === item.id) this.selectedSound = bgSoundItem;
          });
        }
      });
    });
  }

  /**
   * Set selected sound
   * @private
   */
  private setSelectedSound(): void {
    this.authService.getSoundSettings().then(soundSettings => {
      if (soundSettings?.background && this.selectedSound && this.selectedSound.id !== soundSettings?.background?.sound?.id) {
        soundSettings.background.sound = {
          id: this.selectedSound.id,
          name: this.selectedSound.name,
          resource_url: this.selectedSound.resource_url,
        }
        this.authService.setSoundSettings(soundSettings).then(() => this.authService.saveAppSettings());
      }
    });
  }
}
