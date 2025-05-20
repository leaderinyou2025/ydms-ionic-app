import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { IEmotionStreakStatus } from '../../../../shared/interfaces/daily-emotion-journal/daily-emotion-journal.interfaces';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';

@Component({
  selector: 'app-emotion-journal-streak',
  templateUrl: './emotion-journal-streak.component.html',
  styleUrls: ['./emotion-journal-streak.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EmotionJournalStreakComponent implements OnInit {
  @Input() streakStatus: IEmotionStreakStatus | null = null;

  protected readonly TranslateKeys = TranslateKeys;

  constructor() { }

  ngOnInit() {
  }
}
