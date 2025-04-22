import { Injectable } from '@angular/core';

import { HttpClientService } from '../http-client/http-client.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { OdooService } from '../odoo/odoo.service';

import { IAuthData } from '../../shared/interfaces/auth/auth-data';
import { RequestPayload } from '../../shared/classes/request-payload';
import { environment } from '../../../environments/environment';
import { CommonConstants } from '../../shared/classes/common-constants';
import { StorageKey } from '../../shared/enums/storage-key';
import { IResUser } from '../../shared/interfaces/models/res-user';
import { ModelName } from '../../shared/enums/model-name';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authData!: IAuthData | undefined;

  constructor(
    private httpClientService: HttpClientService,
    private odooService: OdooService,
    private localStorageService: LocalStorageService,
  ) {
  }

  /**
   * Check user is authenticated
   */
  public isAuthenticated(): boolean {
    return this.getAuthData() !== undefined;
  }

  /**
   * Get auth data from cache or localStorage
   */
  public getAuthData(): IAuthData | undefined {
    if (!this.authData) {
      this.authData = this.localStorageService.get(StorageKey.AUTH_DATA);
    }

    return this.authData;
  }

  /**
   * Set auth data to cache and localStorage
   * @param authData
   */
  public setAuthData(authData: IAuthData) {
    this.authData = authData;
    this.localStorageService.set(StorageKey.AUTH_DATA, authData);
  }

  /**
   * Authentication user with server
   * @param username
   * @param password
   */
  public async login(username: string, password: string): Promise<boolean> {
    const dataRequest = new RequestPayload();
    dataRequest.params.service = 'common';
    dataRequest.params.method = 'login';
    dataRequest.params.args = [environment.database, username, password];

    // Login function api
    const loginResult = await this.httpClientService.post(environment.serverUrl, dataRequest, {headers: CommonConstants.getRequestHeader()}, 'login');

    if (!loginResult || !loginResult?.result) {
      return false;
    }

    // Get user profile
    const userProfile = await this.getUserProfile(+loginResult.result);

    if (!userProfile) {
      return false;
    }

    // Saved user profile to localStorage
    userProfile.password = password;
    this.setAuthData(userProfile);

    return true;
  }

  /**
   * Get user profile from res.users model
   * @param userId
   * @private
   */
  private async getUserProfile(userId: number): Promise<IAuthData | undefined> {
    const resUserFields = CommonConstants.getKeys<IAuthData>() as string[];
    let results = await this.odooService.read(ModelName.RES_USERS, [userId], resUserFields);
    if (!results || results?.length == 0) return;
    results = CommonConstants.convertArr2ListItem(results);
    if (!results?.length) return;
    return results?.[0];
  }
}
