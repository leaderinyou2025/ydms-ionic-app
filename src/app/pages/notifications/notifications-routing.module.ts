import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsPage } from './notifications.page';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationsPage
  },
  {
    path: ':id',
    component: NotificationDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsPageRoutingModule {
}
