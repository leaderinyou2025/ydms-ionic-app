import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { WallpaperService } from '../../../../../services/wallpaper/wallpaper.service';
import { TranslateKeys } from '../../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../../shared/enums/page-routes';
import { ILiyYdmsAssetsResource } from '../../../../../shared/interfaces/models/liy-ydms-assets-resource';

@Component({
  selector: 'app-avatar-background',
  templateUrl: './avatar-background.component.html',
  styleUrls: ['./avatar-background.component.scss'],
  standalone: false
})
export class AvatarBackgroundComponent implements OnInit {

  wallpapers!: Array<ILiyYdmsAssetsResource>;
  selectedValue!: ILiyYdmsAssetsResource | undefined;
  isBackground!: boolean;

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;

  constructor(
    private location: Location,
    private wallpaperService: WallpaperService,
  ) {
  }

  ngOnInit() {
    let stateData: any = this.location.getState();
    this.isBackground = stateData?.isBackground != undefined ? stateData.isBackground : false;
    this.loadWallpapers();
  }

  /**
   * selectWallpaper
   * @param selectItem
   */
  public async selectWallpaper(selectItem: ILiyYdmsAssetsResource) {
    this.selectedValue = selectItem;
    if (this.isBackground) {
      await this.wallpaperService.setSelectedBackgroundImage(selectItem);
    } else {
      await this.wallpaperService.setSelectedAvatar(selectItem);
    }
  }

  /**
   * loadWallpapers
   * @private
   */
  private loadWallpapers(): void {
    if (this.isBackground) {
      this.wallpaperService.getBackgroundWallpapers().subscribe(images => this.wallpapers = images);
      this.wallpaperService.getSelectedBackgroundImage().then(image => this.selectedValue = image);
    } else {
      this.wallpaperService.getAvatarWallpapers().subscribe(images => this.wallpapers = images);
      this.wallpaperService.getSelectedAvatar().then(image => this.selectedValue = image);
    }
  }
}
