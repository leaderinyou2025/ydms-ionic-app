import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { SelectDatetimeComponent } from './components/select-datetime/select-datetime.component';
import { PinUnlockComponent } from './components/pin-unlock/pin-unlock.component';
import { TranslatePipe } from '@ngx-translate/core';
import { SoundClickDirective } from '../core/directive/sound-click.directive';

@NgModule({
  declarations: [
    SelectDatetimeComponent,
    PinUnlockComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslatePipe,
    SoundClickDirective,
  ],
  exports: [
    SelectDatetimeComponent,
    PinUnlockComponent,
  ]
})
export class SharedModule {
}
