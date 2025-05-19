import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParentDashboardPageRoutingModule } from './parent-dashboard-routing.module';

import { ParentDashboardPage } from './parent-dashboard.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ParentDashboardPageRoutingModule,
        SharedModule
    ],
  declarations: [ParentDashboardPage]
})
export class ParentDashboardPageModule {}
