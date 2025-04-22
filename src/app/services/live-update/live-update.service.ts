import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { LiveUpdate } from '@capawesome/capacitor-live-update';

import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { StorageKey } from '../../shared/enums/storage-key';
import { StorageService } from '../storage/storage.service';
import { IAppVersion } from '../../shared/interfaces/models/app-version';
import { CommonConstants } from '../../shared/classes/common-constants';
import { ModelName } from '../../shared/enums/model-name';
import { OrderBy } from '../../shared/enums/order-by';
import { OdooDomainOperator } from '../../shared/enums/odoo-domain-operator';

@Injectable({
  providedIn: 'root'
})
export class LiveUpdateService {

  private readonly liveUpdateFields!: Array<string>;

  constructor(
    private platform: Platform,
    private odooService: OdooService,
    private storageService: StorageService,
  ) {
    // Load live update model fields from AppVersion interface
    this.liveUpdateFields = CommonConstants.getKeys<IAppVersion>() as string[];
  }

  /**
   * Check and live update app
   */
  async checkUpdateApp(): Promise<void> {
    if (this.platform.is('mobileweb') || (!this.platform.is('ios') && !this.platform.is('android'))) {
      return;
    }

    let localAppVersion = await this.storageService.get<IAppVersion>(StorageKey.CURRENT_APP_VERSION);
    if (!localAppVersion) {
      const appInfo = await App.getInfo();
      const currentAppVersion = await this.getAppVersionString();
      localAppVersion = {
        id: Math.random(),
        name: appInfo.name,
        bundle_id: appInfo.id,
        platform: this.platform.is('android') ? 'android' : 'ios',
        version_build: currentAppVersion || appInfo.version,
        version_code: appInfo.build,
        bundle_file: '',
      };
    }

    const latestVersion = await this.getLatestAppVersion();
    if (!latestVersion || !latestVersion?.version_build || !latestVersion?.bundle_file) {
      console.error('Can not get app version from server.');
      return;
    }

    if (localAppVersion.version_build === latestVersion.version_build) {
      console.error(`The app version ${latestVersion.version_build} is latest.`);
      return;
    }

    await LiveUpdate.downloadBundle({url: latestVersion.bundle_file, bundleId: latestVersion.version_build,});
    // await LiveUpdate.setBundle({bundleId: latestVersion.version_build});
    await this.storageService.set(StorageKey.CURRENT_APP_VERSION, latestVersion);
    await LiveUpdate.reload();
  }

  /**
   * Get latest app version from server
   * @return Promise<IAppVersion | undefined>
   */
  async getLatestAppVersion(): Promise<IAppVersion | undefined> {
    if (!navigator.onLine) return;

    const appInfo = await App.getInfo();
    const platformKey: keyof IAppVersion = 'platform';
    const bundleIdKey: keyof IAppVersion = 'bundle_id';
    const activeKey: keyof IAppVersion = 'active';
    const platform = this.platform.is('android') ? 'android' : 'ios';

    // TODO: Call api to get latest app version
    const args: SearchDomain = [
      [platformKey, OdooDomainOperator.EQUAL, platform],
      [bundleIdKey, OdooDomainOperator.EQUAL, appInfo.id],
      [activeKey, OdooDomainOperator.EQUAL, true]
    ];
    const appVersions: Array<IAppVersion> = await this.odooService.search_read(
      ModelName.APP_VERSIONS, args, this.liveUpdateFields, 0, 1, OrderBy.CREATE_AT_DESC
    );

    return appVersions?.[0];
  }

  /**
   * Get current app version string
   * default version: 1.0.0
   * @return string
   */
  async getAppVersionString(): Promise<string> {
    if (this.platform.is('mobileweb') || (!this.platform.is('ios') && !this.platform.is('android'))) {
      return '1.0.0';
    }

    let localVersion = await this.storageService.get<IAppVersion>(StorageKey.CURRENT_APP_VERSION);
    if (localVersion?.version_build) {
      return localVersion.version_build;
    }

    const currentVersion = await LiveUpdate.getVersionName();
    if (currentVersion) {
      return currentVersion.versionName;
    }

    const appInfo = await App.getInfo();
    return appInfo?.version;
  }
}
