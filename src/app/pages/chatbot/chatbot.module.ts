import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatbotPageRoutingModule } from './chatbot-routing.module';

import { ChatbotPage } from './chatbot.page';
import { SharedModule } from '../../shared/shared.module';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatbotPageRoutingModule,
    SharedModule,
    TranslatePipe
  ],
  declarations: [ChatbotPage]
})
export class ChatbotPageModule {}
