import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamilyActionsPageRoutingModule } from './family-actions-routing.module';

import { FamilyActionsPage } from './family-actions.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FamilyActionsPageRoutingModule,
        SharedModule
    ],
  declarations: [FamilyActionsPage]
})
export class FamilyActionsPageModule {}
