import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { LiyYdmsAvatarService } from '../models/iliy-ydms-avatar.service';
import { ForceTestData } from '../../shared/classes/force-test-data';
import { IAssetsResource } from '../../shared/interfaces/settings/assets-resource';
import { IRelatedField } from '../../shared/interfaces/base/related-field';
import { CommonConstants } from '../../shared/classes/common-constants';

@Injectable({
  providedIn: 'root'
})
export class WallpaperService {

  constructor(
    private authService: AuthService,
    private liyYdmsAvatarService: LiyYdmsAvatarService
  ) {
  }

  /**
   * Load background images from server
   */
  public getBackgroundWallpapers(): Observable<IAssetsResource[]> {
    const images = CommonConstants.background_images;
    return of(images);
  }

  /**
   * Load avatar images from server
   */
  public getAvatarWallpapers(): Promise<IAssetsResource[]> {
    return this.liyYdmsAvatarService.getImages();
  }

  /**
   * Get selected background image from storage
   */
  public async getSelectedBackgroundImage(): Promise<IAssetsResource | undefined> {
    const themeSetting = await this.authService.getThemeSettings();
    if (!themeSetting) return;
    return themeSetting.background;
  }

  /**
   * Save selected background image to storage
   * @param image
   */
  public async setSelectedBackgroundImage(image: IAssetsResource): Promise<void> {
    const themeSetting = await this.authService.getThemeSettings();
    if (!themeSetting) return;
    themeSetting.background = image;
    await this.authService.setThemeSettings(themeSetting);
    await this.authService.saveAppSettings();
  }

  /**
   * Get selected avatar image from storage
   */
  public async getSelectedAvatar(): Promise<IRelatedField | undefined> {
    const authData = await this.authService.getAuthData();
    if (!authData) return;
    return authData.avatar;
  }

  /**
   * Save selected avatar image to storage
   * @param avatar
   */
  public async setSelectedAvatar(avatar: IAssetsResource): Promise<void> {
    const themeSetting = await this.authService.getThemeSettings();
    if (!themeSetting) return;
    themeSetting.avatar = {id: avatar.id, name: avatar.name || ''};
    await this.authService.setThemeSettings(themeSetting);
    await this.authService.saveAppSettings();
    await this.authService.saveUserAvatar();
  }
}
