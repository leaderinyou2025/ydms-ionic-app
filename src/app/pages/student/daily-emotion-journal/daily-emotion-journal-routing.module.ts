import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyEmotionJournalPage } from './daily-emotion-journal.page';
import { AddEmotionJournalComponent } from './add-emotion-journal/add-emotion-journal.component';

const routes: Routes = [
  {
    path: '',
    component: DailyEmotionJournalPage
  },
  {
    path: 'add',
    component: AddEmotionJournalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyEmotionJournalPageRoutingModule {}
