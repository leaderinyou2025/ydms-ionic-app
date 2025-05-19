import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { NotificationsPageRoutingModule } from './notifications-routing.module';
import { NotificationsPage } from './notifications.page';
import { SharedModule } from '../../shared/shared.module';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsPageRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [
    NotificationsPage,
    NotificationDetailComponent
  ]
})
export class NotificationsPageModule {
}
