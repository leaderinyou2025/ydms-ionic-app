import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchoolGroupPageRoutingModule } from './school-group-routing.module';

import { SchoolGroupPage } from './school-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchoolGroupPageRoutingModule
  ],
  declarations: [SchoolGroupPage]
})
export class SchoolGroupPageModule {}
