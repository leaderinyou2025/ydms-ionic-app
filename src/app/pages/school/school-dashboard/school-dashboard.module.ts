import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchoolDashboardPageRoutingModule } from './school-dashboard-routing.module';

import { SchoolDashboardPage } from './school-dashboard.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SchoolDashboardPageRoutingModule,
        SharedModule
    ],
  declarations: [SchoolDashboardPage]
})
export class SchoolDashboardPageModule {}
