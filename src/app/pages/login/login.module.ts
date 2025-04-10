import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {
}
