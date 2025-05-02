import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { IImageResource } from '../../../../shared/interfaces/models/image-resource';
import { WallpaperService } from '../../../../services/wallpaper/wallpaper.service';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../shared/enums/page-routes';

@Component({
  selector: 'app-avatar-background',
  templateUrl: './avatar-background.component.html',
  styleUrls: ['./avatar-background.component.scss'],
  standalone: false
})
export class AvatarBackgroundComponent implements OnInit {

  wallpapers!: Array<IImageResource>;
  selectedValue!: IImageResource | undefined;
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
  public selectWallpaper(selectItem: IImageResource) {
    this.selectedValue = selectItem;
    if (this.isBackground) {
      this.wallpaperService.setSelectedHomeImage(selectItem);
    } else {
      this.wallpaperService.setSelectedAvatar(selectItem);
    }
  }

  /**
   * loadWallpapers
   * @private
   */
  private loadWallpapers(): void {
    if (this.isBackground) {
      this.wallpaperService.getBackgroundWallpapers().subscribe(images => this.wallpapers = images);
      this.wallpaperService.getSelectedHomeImage().then(image => this.selectedValue = image);
    } else {
      this.wallpaperService.getAvatarWallpapers().subscribe(images => this.wallpapers = images);
      this.wallpaperService.getSelectedAvatar().then(image => this.selectedValue = image);
    }
  }
}
