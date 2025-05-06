import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassGroupPage } from './class-group.page';

const routes: Routes = [
  {
    path: '',
    component: ClassGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassGroupPageRoutingModule {}
