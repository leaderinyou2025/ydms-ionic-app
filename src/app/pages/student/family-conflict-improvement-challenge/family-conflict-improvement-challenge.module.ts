import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { FamilyConflictImprovementChallengePageRoutingModule } from './family-conflict-improvement-challenge-routing.module';
import { FamilyConflictImprovementChallengePage } from './family-conflict-improvement-challenge.page';
import { FamilyConflictImprovementChallengeDetailComponent } from './family-conflict-improvement-challenge-detail/family-conflict-improvement-challenge-detail.component';
import { FamilyConflictImprovementChallengeNewComponent } from './family-conflict-improvement-challenge-new/family-conflict-improvement-challenge-new.component';
import { FamilyConflictImprovementChallengeUpdateComponent } from './family-conflict-improvement-challenge-update/family-conflict-improvement-challenge-update.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    FamilyConflictImprovementChallengePageRoutingModule,
    SharedModule
  ],
  declarations: [
    FamilyConflictImprovementChallengePage,
    FamilyConflictImprovementChallengeDetailComponent,
    FamilyConflictImprovementChallengeNewComponent,
    FamilyConflictImprovementChallengeUpdateComponent
  ]
})
export class FamilyConflictImprovementChallengePageModule {}
