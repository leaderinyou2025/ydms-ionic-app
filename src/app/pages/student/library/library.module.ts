import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { LibraryPage } from './library.page';
import { SharedModule } from '../../../shared/shared.module';
import { ResourceListComponent } from '../../../shared/components/resource-list/resource-list.component';
import { LibraryPageRoutingModule } from './library-routing.module';

@NgModule({
  declarations: [LibraryPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LibraryPageRoutingModule,
    SharedModule,
    ResourceListComponent,
  ]
})
export class LibraryPageModule {}
