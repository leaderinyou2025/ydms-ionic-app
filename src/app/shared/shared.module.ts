import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SelectDatetimeComponent } from './components/select-datetime/select-datetime.component';

@NgModule({
  declarations: [
    SelectDatetimeComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    SelectDatetimeComponent
  ]
})
export class SharedModule {
}
