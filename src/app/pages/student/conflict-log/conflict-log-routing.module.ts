import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConflictLogPage } from './conflict-log.page';
import { ConflictLogDetailComponent } from './conflict-log-detail/conflict-log-detail.component';
import { ConflictLogFormComponent } from './conflict-log-form/conflict-log-form.component';

const routes: Routes = [
  {
    path: '',
    component: ConflictLogPage
  },
  {
    path: 'new',
    component: ConflictLogFormComponent
  },
  {
    path: ':id',
    component: ConflictLogDetailComponent
  },
  {
    path: ':id/progress',
    component: ConflictLogFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConflictLogPageRoutingModule {}
