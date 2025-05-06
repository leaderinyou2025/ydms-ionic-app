import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParentDashboardPage } from './parent-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: ParentDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParentDashboardPageRoutingModule {}
