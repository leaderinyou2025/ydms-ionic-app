import { Component, OnInit } from '@angular/core';

import { SoundService } from './services/sound/sound.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private soundService: SoundService
  ) {
  }

  ngOnInit() {
    this.soundService.loadBackgroundSounds();
    this.soundService.loadUserSounds();
  }
}
