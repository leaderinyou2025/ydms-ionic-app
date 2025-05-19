import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamilyActionsPage } from './family-actions.page';

const routes: Routes = [
  {
    path: '',
    component: FamilyActionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamilyActionsPageRoutingModule {}
