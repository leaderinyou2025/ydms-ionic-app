import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpertGuidePageRoutingModule } from './expert-guide-routing.module';

import { ExpertGuidePage } from './expert-guide.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ExpertGuidePageRoutingModule,
        SharedModule
    ],
  declarations: [ExpertGuidePage]
})
export class ExpertGuidePageModule {}
