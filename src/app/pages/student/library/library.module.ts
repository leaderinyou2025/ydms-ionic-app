import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { LibraryPage } from './library.page';
import { SharedModule } from '../../../shared/shared.module';
import { LibraryPageRoutingModule } from './library-routing.module';
import { ViewResourceComponent } from './view-resource/view-resource.component';

@NgModule({
  declarations: [
    LibraryPage,
    ViewResourceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LibraryPageRoutingModule,
    SharedModule,
  ]
})
export class LibraryPageModule {
}
