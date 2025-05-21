import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamilyConflictImprovementChallengePage } from './family-conflict-improvement-challenge.page';
import { FamilyConflictImprovementChallengeDetailComponent } from './family-conflict-improvement-challenge-detail/family-conflict-improvement-challenge-detail.component';
import { FamilyConflictImprovementChallengeNewComponent } from './family-conflict-improvement-challenge-new/family-conflict-improvement-challenge-new.component';
import { FamilyConflictImprovementChallengeUpdateComponent } from './family-conflict-improvement-challenge-update/family-conflict-improvement-challenge-update.component';

const routes: Routes = [
  {
    path: '',
    component: FamilyConflictImprovementChallengePage
  },
  {
    path: 'new',
    component: FamilyConflictImprovementChallengeNewComponent
  },
  {
    path: 'update/:id',
    component: FamilyConflictImprovementChallengeUpdateComponent
  },
  {
    path: ':id',
    component: FamilyConflictImprovementChallengeDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamilyConflictImprovementChallengePageRoutingModule {}
