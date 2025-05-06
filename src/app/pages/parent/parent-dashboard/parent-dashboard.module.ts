import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParentDashboardPageRoutingModule } from './parent-dashboard-routing.module';

import { ParentDashboardPage } from './parent-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParentDashboardPageRoutingModule
  ],
  declarations: [ParentDashboardPage]
})
export class ParentDashboardPageModule {}
