import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassGroupPageRoutingModule } from './class-group-routing.module';

import { ClassGroupPage } from './class-group.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ClassGroupPageRoutingModule,
        SharedModule
    ],
  declarations: [ClassGroupPage]
})
export class ClassGroupPageModule {}
