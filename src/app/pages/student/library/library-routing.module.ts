import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LibraryPage } from './library.page';
import { ViewResourceComponent } from './view-resource/view-resource.component';

const routes: Routes = [
  {
    path: '',
    component: LibraryPage
  },
  {
    path: ':id',
    component: ViewResourceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryPageRoutingModule {
}
