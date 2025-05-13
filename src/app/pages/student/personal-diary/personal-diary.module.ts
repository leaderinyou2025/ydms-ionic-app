import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { PersonalDiaryPageRoutingModule } from './personal-diary-routing.module';

import { PersonalDiaryPage } from './personal-diary.page';
import {SharedModule} from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonalDiaryPageRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [PersonalDiaryPage]
})
export class PersonalDiaryPageModule {}
