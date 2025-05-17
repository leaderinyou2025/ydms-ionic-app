import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ResourceDetailPage } from './resource-detail.page';
import { SharedModule } from '../../../../shared/shared.module';
import { ResourceViewerComponent } from '../../../../shared/components/resource-viewer/resource-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: ResourceDetailPage
  }
];

@NgModule({
  declarations: [ResourceDetailPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes),
    SharedModule,
    ResourceViewerComponent
  ]
})
export class ResourceDetailPageModule {}
