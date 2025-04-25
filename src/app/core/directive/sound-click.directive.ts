import { Directive, HostListener, Input } from '@angular/core';
import { SoundService } from '../../services/sound/sound.service';
import { SoundKeys } from '../../shared/enums/sound-keys';

@Directive({
  selector: '[appSoundClick]',
  standalone: true
})
export class SoundClickDirective {
  @Input('appSoundClick') isOnSound: boolean = true;

  constructor(
    private soundService: SoundService
  ) {
  }

  @HostListener('pointerdown')
  handleClick() {
    if (!this.isOnSound) return;
    this.soundService.playEffect(SoundKeys.CLICK);
  }
}
