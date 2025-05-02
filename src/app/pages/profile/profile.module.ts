import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';

import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { AccountAndSecurityComponent } from './account-and-security/account-and-security.component';
import { ContactAndSupportComponent } from './contact-and-support/contact-and-support.component';
import { NotificationAndSoundComponent } from './notification-and-sound/notification-and-sound.component';
import { PrivacyRightsComponent } from './privacy-rights/privacy-rights.component';
import { ReportProblemsComponent } from './report-problems/report-problems.component';
import { TermsAndPoliciesComponent } from './terms-and-policies/terms-and-policies.component';
import { ThemeAndBackgroundComponent } from './theme-and-background/theme-and-background.component';
import { SharedModule } from '../../shared/shared.module';
import { AvatarBackgroundComponent } from './theme-and-background/avatar-background/avatar-background.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedModule,
    TranslatePipe
  ],
  declarations: [
    ProfilePage,
    AccountAndSecurityComponent,
    ContactAndSupportComponent,
    NotificationAndSoundComponent,
    PrivacyRightsComponent,
    ReportProblemsComponent,
    TermsAndPoliciesComponent,
    ThemeAndBackgroundComponent,
    AvatarBackgroundComponent,
  ]
})
export class ProfilePageModule {
}
