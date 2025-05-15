import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { HttpClientService } from '../http-client/http-client.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { OdooService } from '../odoo/odoo.service';
import { StorageService } from '../storage/storage.service';

import { IAuthData } from '../../shared/interfaces/auth/auth-data';
import { RequestPayload } from '../../shared/classes/request-payload';
import { environment } from '../../../environments/environment';
import { CommonConstants } from '../../shared/classes/common-constants';
import { StorageKey } from '../../shared/enums/storage-key';
import { ModelName } from '../../shared/enums/model-name';
import { AlertController, AlertOptions, LoadingController, NavController } from '@ionic/angular';
import { BtnRoles } from '../../shared/enums/btn-roles';
import { NativePlatform } from '../../shared/enums/native-platform';
import { PageRoutes } from '../../shared/enums/page-routes';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { OdooJsonrpcServiceNames } from '../../shared/enums/odoo-jsonrpc-service-names';
import { OdooMethodName } from '../../shared/enums/odoo-method-name';
import { IUserSettings } from '../../shared/interfaces/settings/user-settings';
import { IAccountSecuritySettings } from '../../shared/interfaces/settings/account-security-settings';
import { INotificationSettings } from '../../shared/interfaces/settings/notification-settings';
import { ISoundSettings } from '../../shared/interfaces/settings/sound-settings';
import { IThemeSettings } from '../../shared/interfaces/settings/theme-settings';
import { IPrivacyRightsSettings } from '../../shared/interfaces/settings/privacy-rights-settings';
import { UserRoles } from '../../shared/enums/user-roles';
import { Theme } from '../../shared/enums/theme';
import { TextZoomSize } from '../../shared/enums/text-zoom-size';
import { ForceTestData } from '../../shared/classes/force-test-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authData!: IAuthData | undefined;
  private userRoles!: UserRoles | undefined;
  private userFields = [
    'name', 'email', 'phone', 'street', 'precint_id', 'district_id', 'state_id', 'country_id', 'image_128', 'lang',
    'nickname', 'avatar', 'avatar_128', 'code', 'edu_id', 'social_id',
    'is_teenager', 'is_parent', 'is_teacher',
    'school_id', 'classroom_id', 'parent_id', 'partner_id', 'classroom_ids', 'child_ids'
  ];

  constructor(
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private router: Router,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private storageService: StorageService,
    private httpClientService: HttpClientService,
    private odooService: OdooService,
  ) {
  }

  /**
   * Check user is authenticated
   */
  public isAuthenticated(): boolean {
    const authToken = this.localStorageService.get<string>(StorageKey.AUTH_TOKEN_SESSION);
    return authToken !== undefined;
  }

  /**
   * Get cache user role
   */
  public getRole(): UserRoles | undefined {
    if (!this.userRoles) this.userRoles = this.localStorageService.get<UserRoles>(StorageKey.USER_ROLE);
    return this.userRoles;
  }

  /**
   * Set cache user role
   * @param role
   */
  public setRole(role: UserRoles): void {
    this.userRoles = role;
    this.localStorageService.set<UserRoles>(StorageKey.USER_ROLE, this.userRoles);
  }

  /**
   * Encrypt password and save to session
   * @param password
   */
  public saveAuthToken(password: string): void {
    if (!password) return;
    CommonConstants.encrypt(password).then(encryptedPassword => this.localStorageService.set(StorageKey.AUTH_TOKEN_SESSION, encryptedPassword));
  }

  /**
   * Decrypt auth token to password
   * @return string
   */
  public async getAuthToken(): Promise<string | undefined> {
    const authToken = this.localStorageService.get<string>(StorageKey.AUTH_TOKEN_SESSION);
    if (!authToken) return undefined;
    const decryptedPassword = await CommonConstants.decrypt(authToken);
    if (!decryptedPassword?.length) return undefined;
    return decryptedPassword;
  }

  /**
   * Get auth data from cache or localStorage
   */
  public async getAuthData(): Promise<IAuthData | undefined> {
    if (!this.authData) this.authData = await this.storageService.get(StorageKey.AUTH_DATA);
    return this.authData;
  }

  /**
   * Set auth data to cache and localStorage
   * @param authData
   * @param isSyncServer
   */
  public async setAuthData(authData: IAuthData, isSyncServer: boolean = false): Promise<void> {
    this.authData = authData;
    await this.storageService.set<IAuthData>(StorageKey.AUTH_DATA, authData);
    if (!authData.user_settings) await this.initNewUserSettings();
    if (isSyncServer) await this.saveUserProfile();
  }

  /**
   * getUserSettings
   * @Promise<IUserSettings | undefined>
   */
  public async getUserSettings(): Promise<IUserSettings | undefined> {
    const authData = await this.getAuthData();
    if (!authData) return;
    return authData.user_settings;
  }

  /**
   * setUserSettings
   * @param userSettings
   * @param isSyncServer
   * @Promise<void>
   */
  public async setUserSettings(userSettings: IUserSettings, isSyncServer: boolean = false): Promise<void> {
    const authData = await this.getAuthData();
    if (!authData) return;
    authData.user_settings = userSettings;
    await this.setAuthData(authData, isSyncServer);
  }

  /**
   * getAccountSecuritySettings
   * @Promise<IAccountSecuritySettings | undefined>
   */
  public async getAccountSecuritySettings(): Promise<IAccountSecuritySettings | undefined> {
    const userSettings = await this.getUserSettings();
    if (!userSettings) return;
    return userSettings.account_security;
  }

  /**
   * setAccountSecuritySettings
   * @Promise<void>
   */
  public async setAccountSecuritySettings(accountSecuritySettings: IAccountSecuritySettings, isSyncServer: boolean = false): Promise<void> {
    const userSettings = await this.getUserSettings();
    if (!userSettings) return;
    userSettings.account_security = accountSecuritySettings;
    await this.setUserSettings(userSettings, isSyncServer);
  }

  /**
   * getThemeSettings
   * @Promise<IThemeSettings | undefined>
   */
  public async getThemeSettings(): Promise<IThemeSettings | undefined> {
    const userSettings = await this.getUserSettings();
    if (!userSettings) return;
    return userSettings.theme;
  }

  /**
   * setThemeSettings
   * @Promise<void>
   */
  public async setThemeSettings(themeSettings: IThemeSettings, isSyncServer: boolean = false): Promise<void> {
    const userSettings = await this.getUserSettings();
    if (!userSettings) return;
    userSettings.theme = themeSettings;
    await this.setUserSettings(userSettings, isSyncServer);
  }

  /**
   * getSoundSettings
   * @Promise<ISoundSettings | undefined>
   */
  public async getSoundSettings(): Promise<ISoundSettings | undefined> {
    const userSettings = await this.getUserSettings();
    if (!userSettings) return;
    return userSettings.sound;
  }

  /**
   * setSoundSettings
   * @Promise<void>
   */
  public async setSoundSettings(soundSettings: ISoundSettings, isSyncServer: boolean = false): Promise<void> {
    const userSettings = await this.getUserSettings();
    if (!userSettings) return;
    userSettings.sound = soundSettings;
    await this.setUserSettings(userSettings, isSyncServer);
  }

  /**
   * getNotificationSettings
   * @Promise<INotificationSettings | undefined>
   */
  public async getNotificationSettings(): Promise<INotificationSettings | undefined> {
    const userSettings = await this.getUserSettings();
    if (!userSettings) return;
    return userSettings.notification;
  }

  /**
   * setNotificationSettings
   * @Promise<void>
   */
  public async setNotificationSettings(notificationSettings: INotificationSettings, isSyncServer: boolean = false): Promise<void> {
    const userSettings = await this.getUserSettings();
    if (!userSettings) return;
    userSettings.notification = notificationSettings;
    await this.setUserSettings(userSettings, isSyncServer);
  }

  /**
   * getPrivacyRightSettings
   * @Promise<IPrivacyRightsSettings | undefined>
   */
  public async getPrivacyRightSettings(): Promise<IPrivacyRightsSettings | undefined> {
    const userSettings = await this.getUserSettings();
    if (!userSettings) return;
    return userSettings.notification;
  }

  /**
   * setPrivacyRightSettings
   * @Promise<void>
   */
  public async setPrivacyRightSettings(privacyRightsSettings: IPrivacyRightsSettings, isSyncServer: boolean = false): Promise<void> {
    const userSettings = await this.getUserSettings();
    if (!userSettings) return;
    userSettings.privacy_rights = privacyRightsSettings;
    await this.setUserSettings(userSettings, isSyncServer);
  }

  /**
   * Authentication user with server
   * @param username
   * @param password
   */
  public async login(username: string, password: string): Promise<boolean> {
    const dataRequest = new RequestPayload();
    dataRequest.params.service = OdooJsonrpcServiceNames.COMMON;
    dataRequest.params.method = OdooMethodName.LOGIN;
    dataRequest.params.args = [environment.database, username, password];

    // Login function api
    let loginResult = await this.httpClientService.post(
      environment.serverUrl, dataRequest,
      {headers: CommonConstants.getRequestHeader()},
      {operation: 'login'}
    );
    if (!loginResult || !loginResult?.result) {
      return false;
    }

    // Set temp data after login success
    this.saveAuthToken(password);
    const tempUserProfile = {id: +loginResult.result, login: username, is_teenager: false, is_teacher: false, is_parent: false};
    this.authData = tempUserProfile;
    await this.setAuthData(tempUserProfile, false);

    // Load user profile
    return this.loadUserProfile();
  }

  /**
   * Clear storage data
   */
  public logout(): void {
    const alertOption: AlertOptions = {
      header: this.translate.instant(TranslateKeys.ALERT_DEFAULT_HEADER),
      message: this.translate.instant(TranslateKeys.ALERT_CONFIRM_LOGOUT),
      buttons: [
        {text: this.translate.instant(TranslateKeys.BUTTON_CANCEL), role: BtnRoles.CANCEL},
        {text: this.translate.instant(TranslateKeys.BUTTON_CONFIRM), handler: () => this.handleLogout()}
      ]
    }
    this.alertCtrl.create(alertOption).then(alert => alert.present());
  }

  /**
   * getBasicAuthHeader
   */
  public async getBasicAuthHeader(): Promise<HttpHeaders | undefined> {
    const authData = await this.getAuthData();
    const password = await this.getAuthToken();
    if (!authData || !password) return;
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${authData.login}:${password}`)
    });
  }

  /**
   * Change user password
   * @param currentPassword Current password for verification
   * @param newPassword New password to set
   * @returns Promise<boolean> Success status
   */
  public async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const authData = await this.getAuthData();
      if (!authData) return false;

      // Verify current password matches stored password
      const storedPassword = await this.getAuthToken();
      if (currentPassword !== storedPassword) {
        return false;
      }

      const result = await this.odooService.callKw(ModelName.RES_USERS, OdooMethodName.CHANGE_PASSWORD, [currentPassword, newPassword]);
      return !!result;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  }

  /**
   * Load and save user profile
   */
  public async loadUserProfile(): Promise<boolean> {
    const authData = await this.getAuthData();
    if (!authData) return false;

    const userProfile = await this.getUserProfile(authData.id);
    if (!userProfile) {
      return false;
    }

    // Saved user profile to localStorage not sync back to server
    this.setRole(userProfile.is_parent ? UserRoles.PARENT : (userProfile.is_teacher ? UserRoles.TEACHER : UserRoles.STUDENT));
    this.authData = userProfile;
    await this.setAuthData(userProfile, false);
    return true;
  }

  /**
   * Show confirm and handle logout
   * @private
   */
  private handleLogout(): void {
    this.loadingController.create({mode: NativePlatform.IOS}).then(loading => {
      loading.present().finally(() => {
        this.clearStorageUserData()
          .then(() => this.navCtrl.navigateRoot(`/${PageRoutes.LOGIN}}`, {replaceUrl: true}))
          .finally(() => this.router.navigateByUrl(PageRoutes.LOGIN).finally(() => loading.dismiss()));
      });
    });
  }

  /**
   * Clear all user data on localStorage and storage
   * @private
   */
  private async clearStorageUserData(): Promise<void> {
    this.authData = undefined;
    // Xóa sạch localStorage chỉ giữ lại những common config
    this.localStorageService.clear([
      StorageKey.LANGUAGE,
      StorageKey.FIREBASE_DEVICE_TOKEN,
      StorageKey.ENABLE_BIOMETRIC,
      StorageKey.BIOMETRIC_AVAILABLE_RESULT
    ]);
    // Xóa sạch storage chỉ giữ lại lịch sử tài khoản đăng nhập
    await this.storageService.clear([StorageKey.ACCOUNT_HISTORY]);
  }

  /**
   * Get user profile from res.users model
   * @param userId
   * @private
   */
  private async getUserProfile(userId: number): Promise<IAuthData | undefined> {
    let results = await this.odooService.read<IAuthData>(ModelName.RES_USERS, [userId], this.userFields);
    if (!results || results?.length == 0) return;
    results = CommonConstants.convertArr2ListItem(results);
    if (!results?.length) return;
    return results?.[0];
  }

  /**
   * Save user profile to res.users
   * @private
   */
  private async saveUserProfile(): Promise<boolean | number> {
    return this.saveUserAvatar();
    // const authData = await this.getAuthData();
    // if (!authData) return false;
    // return await this.odooService.write<IAuthData>(ModelName.RES_USERS, [authData.id], authData);
  }

  /**
   * Save user avatar selected
   * @private
   */
  private async saveUserAvatar(): Promise<boolean | number> {
    const authData = await this.getAuthData();
    if (!authData || !authData?.user_settings?.theme?.avatar?.id) return false;
    const params = {avatar: authData.user_settings.theme.avatar.id};
    return await this.odooService.write(ModelName.RES_USERS, [authData.id], params);
  }

  /**
   * Init user settings
   * @private
   */
  private async initNewUserSettings(): Promise<void> {
    let userSettings = await this.getUserSettings();
    if (userSettings) return;
    userSettings = {
      notification: {enabled: true},
      sound: {
        enabled: true,
        touch: {
          enabled: true,
          volume: 0.7,
          sound: ForceTestData.background_sounds[0]
        },
        reload: {
          enabled: true,
          volume: 0.7,
          sound: ForceTestData.background_sounds[1]
        },
        notification: {
          enabled: true,
          volume: 0.7,
          sound: ForceTestData.background_sounds[2]
        },
        background: {
          enabled: true,
          volume: 0.5,
          sound: ForceTestData.background_sounds[3]
        },
      },
      privacy_rights: {},
      theme: {
        theme_model: Theme.SYSTEM,
        text_size: TextZoomSize.MEDIUM,
        avatar: this.authData?.avatar ? {
          id: this.authData.avatar.id,
          name: this.authData.avatar.name,
          resource_url: this.authData?.avatar_128 && CommonConstants.detectMimeType(this.authData.avatar_128) ?
            `${CommonConstants.detectMimeType(this.authData.avatar_128)}${this.authData.avatar_128}`
            : ForceTestData.avatar_images[0].resource_url,
        } : ForceTestData.avatar_images[0],
        background: ForceTestData.background_images[0],
      },
      account_security: {}
    };
    await this.setUserSettings(userSettings, false);
  }
}
