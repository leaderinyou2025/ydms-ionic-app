import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchoolDashboardPage } from './school-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: SchoolDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchoolDashboardPageRoutingModule {}
