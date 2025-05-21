import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { ConflictLogPageRoutingModule } from './conflict-log-routing.module';
import { ConflictLogPage } from './conflict-log.page';
import { ConflictLogDetailComponent } from './conflict-log-detail/conflict-log-detail.component';
import { ConflictLogFormComponent } from './conflict-log-form/conflict-log-form.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ConflictLogPage,
    ConflictLogDetailComponent,
    ConflictLogFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    ConflictLogPageRoutingModule,
    SharedModule
  ]
})
export class ConflictLogPageModule {}
