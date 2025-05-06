import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamilyGroupPage } from './family-group.page';

const routes: Routes = [
  {
    path: '',
    component: FamilyGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamilyGroupPageRoutingModule {}
