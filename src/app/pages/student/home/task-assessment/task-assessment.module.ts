import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {TaskAssessmentPage} from './task-assessment.page';
import {SharedModule} from "../../../../shared/shared.module";

const routes: Routes = [
  {
    path: '',
    component: TaskAssessmentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
    SharedModule
  ],
  declarations: [TaskAssessmentPage]
})
export class TaskAssessmentPageModule {
}
