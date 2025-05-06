import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfilePage } from './profile.page';
import { AccountAndSecurityComponent } from './account-and-security/account-and-security.component';
import { ThemeAndBackgroundComponent } from './theme-and-background/theme-and-background.component';
import { NotificationAndSoundComponent } from './notification-and-sound/notification-and-sound.component';
import { PrivacyRightsComponent } from './privacy-rights/privacy-rights.component';
import { ReportProblemsComponent } from './report-problems/report-problems.component';
import { ContactAndSupportComponent } from './contact-and-support/contact-and-support.component';
import { TermsAndPoliciesComponent } from './terms-and-policies/terms-and-policies.component';
import { AvatarBackgroundComponent } from './theme-and-background/avatar-background/avatar-background.component';
import { PageRoutes } from '../../../shared/enums/page-routes';
import { PersonalInfoComponent } from './account-and-security/personal-info/personal-info.component';
import { AppLockSettingsComponent } from './account-and-security/app-lock-settings/app-lock-settings.component';
import { ChangePasswordComponent } from './account-and-security/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
  },
  {
    path: PageRoutes.THEME_AND_BACKGROUND,
    component: ThemeAndBackgroundComponent,
  },
  {
    path: PageRoutes.AVATAR_BACKGROUND,
    component: AvatarBackgroundComponent,
  },
  {
    path: PageRoutes.NOTIFICATION_AND_SOUND,
    component: NotificationAndSoundComponent,
  },
  {
    path: PageRoutes.ACCOUNT_AND_SECURITY,
    component: AccountAndSecurityComponent,
  },
  {
    path: PageRoutes.PRIVACY_RIGHTS,
    component: PrivacyRightsComponent,
  },
  {
    path: PageRoutes.REPORT_PROBLEMS,
    component: ReportProblemsComponent,
  },
  {
    path: PageRoutes.CONTACT_AND_SUPPORT,
    component: ContactAndSupportComponent,
  },
  {
    path: PageRoutes.TERMS_AND_POLICIES,
    component: TermsAndPoliciesComponent,
  },
  {
    path: PageRoutes.PERSONAL_INFO,
    component: PersonalInfoComponent,
  },
  {
    path: PageRoutes.APP_LOCK_SETTINGS,
    component: AppLockSettingsComponent,
  },
  {
    path: PageRoutes.CHANGE_PASSWORD,
    component: ChangePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {
}
