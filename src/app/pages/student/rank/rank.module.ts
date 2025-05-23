import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { RankPageRoutingModule } from './rank-routing.module';
import { RankPage } from './rank.page';
import { SharedModule } from '../../../shared/shared.module';
import { IonInfiniteHorizontalDirective } from '../../../core/directive/ion-infinite-horizontal.directive';
import { BadgeHorizontalListComponent } from './badge-horizontal-list/badge-horizontal-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RankPageRoutingModule,
    TranslateModule,
    SharedModule,
    IonInfiniteHorizontalDirective
  ],
  declarations: [RankPage, BadgeHorizontalListComponent],
})
export class RankPageModule {
}
