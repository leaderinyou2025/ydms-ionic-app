import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpertGuidePage } from './expert-guide.page';

const routes: Routes = [
  {
    path: '',
    component: ExpertGuidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpertGuidePageRoutingModule {}
