import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamilyGroupPageRoutingModule } from './family-group-routing.module';

import { FamilyGroupPage } from './family-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamilyGroupPageRoutingModule
  ],
  declarations: [FamilyGroupPage]
})
export class FamilyGroupPageModule {}
