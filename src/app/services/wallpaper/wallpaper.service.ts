import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { OdooService } from '../odoo/odoo.service';
import { StorageService } from '../storage/storage.service';
import { StorageKey } from '../../shared/enums/storage-key';
import { IImageResource } from '../../shared/interfaces/models/image-resource';

@Injectable({
  providedIn: 'root'
})
export class WallpaperService {

  constructor(
    private odooService: OdooService,
    private storageService: StorageService,
  ) {
  }

  /**
   * Load background image from server
   */
  public getBackgroundWallpapers(): Observable<IImageResource[]> {
    // TODO: Call API to load background images wallpapers
    const images: Array<IImageResource> = [
      {id: 1, resource_url: 'assets/images/background/bananas-7840213_1920.jpg', name: 'Chuối vườn nhà'},
      {id: 2, resource_url: 'assets/images/background/beach-5234306_1920.jpg', name: 'Biển Đông'},
      {id: 3, resource_url: 'assets/images/background/city-7629244_1920.jpg', name: 'Thành phố phồn hoa'},
      {id: 4, resource_url: 'assets/images/background/santa-claus-6845491_1920.jpg', name: 'Ông già Noel'},
    ];
    return of(images);
  }

  /**
   * Load avatar image from server
   */
  public getAvatarWallpapers(): Observable<IImageResource[]> {
    // TODO: Call API to load background images wallpapers
    const images: Array<IImageResource> = [
      {id: 1, resource_url: 'assets/images/avatar/Shiba-Inu-Dog.png', name: 'Shiba-Inu-Dog'},
      {id: 2, resource_url: 'assets/images/avatar/Shiba-Inu-Dog-1.png', name: 'Shiba-Inu-Dog-1'},
      {id: 3, resource_url: 'assets/images/avatar/Shiba-Inu-Dog-2.png', name: 'Shiba-Inu-Dog-2'},
      {id: 4, resource_url: 'assets/images/avatar/Shiba-Inu-Dog-3.png', name: 'Shiba-Inu-Dog-3'},
      {id: 5, resource_url: 'assets/images/avatar/Shiba-Inu-Dog-Showing-Muscles.png', name: 'Shiba-Inu-Dog-Showing-Muscles'},
    ];
    return of(images);
  }

  /**
   * Get selected background image from storage
   */
  public getSelectedHomeImage(): Promise<IImageResource | undefined> {
    return this.storageService.get<IImageResource>(StorageKey.HOME_BACKGROUND_IMAGE);
  }

  /**
   * Save selected background image to storage
   * @param image
   */
  public setSelectedHomeImage(image: IImageResource): Promise<void> {
    return this.storageService.set(StorageKey.HOME_BACKGROUND_IMAGE, image);
  }

  /**
   * Get selected avatar image from storage
   */
  public getSelectedAvatar(): Promise<IImageResource | undefined> {
    return this.storageService.get<IImageResource>(StorageKey.HOME_AVATAR_IMAGE);
  }

  /**
   * Save selected avatar image to storage
   * @param avatar
   */
  public setSelectedAvatar(avatar: IImageResource): Promise<void> {
    return this.storageService.set(StorageKey.HOME_AVATAR_IMAGE, avatar);
  }
}
