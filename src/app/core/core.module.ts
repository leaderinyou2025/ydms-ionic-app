import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomNumberPipe } from './pipes/custom-number.pipe';


@NgModule({
  declarations: [
    CustomNumberPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CustomNumberPipe
  ]
})
export class CoreModule {
}
