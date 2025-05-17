import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { DailyEmotionJournalPageRoutingModule } from './daily-emotion-journal-routing.module';
import { DailyEmotionJournalPage } from './daily-emotion-journal.page';
import { EmotionJournalCalendarComponent } from './calendar/emotion-journal-calendar.component';
import { EmotionJournalStreakComponent } from './streak-status/emotion-journal-streak.component';
import { AddEmotionJournalComponent } from './add-emotion-journal/add-emotion-journal.component';
import { SharedModule } from '../../../shared/shared.module';
import { EmotionIconSelectorComponent } from '../../../shared/components/emotion-icon-selector/emotion-icon-selector.component';
import { EmotionShareComponent } from '../../../shared/components/emotion-share/emotion-share.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyEmotionJournalPageRoutingModule,
    TranslateModule,
    SharedModule,
    DailyEmotionJournalPage,
    AddEmotionJournalComponent
  ],
  declarations: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DailyEmotionJournalPageModule {}
