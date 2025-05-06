import { INotificationSettings } from './notification-settings';
import { IThemeSettings } from './theme-settings';
import { ISoundSettings } from './sound-settings';
import { IAccountSecuritySettings } from './account-security-settings';
import { IPrivacyRightsSettings } from './privacy-rights-settings';

export interface IUserSettings {
  account_security: IAccountSecuritySettings,
  theme: IThemeSettings,
  sound: ISoundSettings,
  notification: INotificationSettings,
  privacy_rights: IPrivacyRightsSettings,
}
