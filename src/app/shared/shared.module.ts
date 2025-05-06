import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { SelectDatetimeComponent } from './components/select-datetime/select-datetime.component';
import { PinUnlockComponent } from './components/pin-unlock/pin-unlock.component';
import { FooterComponent } from './components/footer/footer.component';
import { ImageCarouselSelectComponent } from './components/image-carousel-select/image-carousel-select.component';
import { SoundClickDirective } from '../core/directive/sound-click.directive';

@NgModule({
  declarations: [
    SelectDatetimeComponent,
    PinUnlockComponent,
    FooterComponent,
    ImageCarouselSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslatePipe,
    SoundClickDirective,
    RouterLink,
    RouterLinkActive,
  ],
  exports: [
    SelectDatetimeComponent,
    PinUnlockComponent,
    FooterComponent,
    ImageCarouselSelectComponent
  ]
})
export class SharedModule {
}
