import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

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
import { IUserRoles } from '../../shared/enums/user-roles';
import { AlertController, AlertOptions, LoadingController, NavController } from '@ionic/angular';
import { BtnRoles } from '../../shared/enums/btn-roles';
import { NativePlatform } from '../../shared/enums/native-platform';
import { PageRoutes } from '../../shared/enums/page-routes';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { OdooJsonrpcServiceNames } from '../../shared/enums/odoo-jsonrpc-service-names';
import { OdooMethodName } from '../../shared/enums/odoo-method-name';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authData!: IAuthData | undefined;

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
    return this.getAuthToken() !== undefined;
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
   */
  public async setAuthData(authData: IAuthData): Promise<void> {
    await this.storageService.set(StorageKey.AUTH_DATA, authData);
  }

  /**
   * Encrypt password and save to session
   * @param password
   */
  public saveAuthToken(password: string): void {
    if (!password) return;
    const encryptedPassword = CommonConstants.encrypt(password);
    this.localStorageService.set(StorageKey.AUTH_TOKEN_SESSION, encryptedPassword);
  }

  /**
   * Decrypt auth token to password
   * @return string
   */
  public getAuthToken(): string | undefined {
    const authToken = this.localStorageService.get<string>(StorageKey.AUTH_TOKEN_SESSION);
    if (!authToken) return undefined;
    const decryptedPassword = CommonConstants.decrypt(authToken);
    if (!decryptedPassword?.length) return undefined;
    return decryptedPassword;
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
    const loginResult = await this.httpClientService.post(environment.serverUrl, dataRequest, {headers: CommonConstants.getRequestHeader()}, {operation: 'login'});
    if (!loginResult || !loginResult?.result) {
      return false;
    }

    // Get user profile
    const userProfile = await this.getUserProfile(+loginResult.result);

    if (!userProfile) {
      return false;
    }

    // Saved user profile to localStorage
    this.saveAuthToken(password);
    await this.setAuthData(userProfile);

    return true;
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
      StorageKey.ENABLE_BIOMETRIC
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
    const resUserFields = CommonConstants.getKeys<IAuthData>() as string[];
    let results = await this.odooService.read<IAuthData>(ModelName.RES_USERS, [userId], resUserFields);
    if (!results || results?.length == 0) return;
    results = CommonConstants.convertArr2ListItem(results);
    if (!results?.length) return;
    return results?.[0];
  }
}
