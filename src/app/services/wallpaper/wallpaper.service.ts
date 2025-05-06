import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { OdooService } from '../odoo/odoo.service';
import { AuthService } from '../auth/auth.service';
import { StorageKey } from '../../shared/enums/storage-key';
import { ForceTestData } from '../../shared/classes/force-test-data';
import { ILiyYdmsAssetsResource } from '../../shared/interfaces/models/liy-ydms-assets-resource';

@Injectable({
  providedIn: 'root'
})
export class WallpaperService {

  constructor(
    private odooService: OdooService,
    private authService: AuthService,
  ) {
  }

  /**
   * Load background images from server
   */
  public getBackgroundWallpapers(): Observable<ILiyYdmsAssetsResource[]> {
    // TODO: Call API to load background images wallpapers
    const images = ForceTestData.background_images;
    return of(images);
  }

  /**
   * Load avatar images from server
   */
  public getAvatarWallpapers(): Observable<ILiyYdmsAssetsResource[]> {
    // TODO: Call API to load background images wallpapers
    const images = ForceTestData.avatar_images;
    return of(images);
  }

  /**
   * Get selected background image from storage
   */
  public async getSelectedBackgroundImage(): Promise<ILiyYdmsAssetsResource | undefined> {
    const themeSetting = await this.authService.getThemeSettings();
    if (!themeSetting) return;
    return themeSetting.background;
  }

  /**
   * Save selected background image to storage
   * @param image
   */
  public async setSelectedBackgroundImage(image: ILiyYdmsAssetsResource): Promise<void> {
    const themeSetting = await this.authService.getThemeSettings();
    if (!themeSetting) return;
    themeSetting.background = image;
    await this.authService.setThemeSettings(themeSetting);
  }

  /**
   * Get selected avatar image from storage
   */
  public async getSelectedAvatar(): Promise<ILiyYdmsAssetsResource | undefined> {
    const themeSetting = await this.authService.getThemeSettings();
    if (!themeSetting) return;
    return themeSetting.avatar;
  }

  /**
   * Save selected avatar image to storage
   * @param avatar
   */
  public async setSelectedAvatar(avatar: ILiyYdmsAssetsResource): Promise<void> {
    const themeSetting = await this.authService.getThemeSettings();
    if (!themeSetting) return;
    themeSetting.avatar = avatar;
    await this.authService.setThemeSettings(themeSetting);
  }
}
