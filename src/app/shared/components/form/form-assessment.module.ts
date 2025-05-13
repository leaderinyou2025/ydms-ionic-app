import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {FormAssessmentPage} from './form-assessment.page';
import {SharedModule} from "../../shared.module";

const routes: Routes = [
  {
    path: '',
    component: FormAssessmentPage
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
  declarations: [FormAssessmentPage]
})
export class FormAssessmentPageModule {
}
