import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchoolDashboardPageRoutingModule } from './school-dashboard-routing.module';

import { SchoolDashboardPage } from './school-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchoolDashboardPageRoutingModule
  ],
  declarations: [SchoolDashboardPage]
})
export class SchoolDashboardPageModule {}
