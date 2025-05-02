import { Component, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ThemeService } from '../../../services/theme/theme.service';
import { TextZoomService } from '../../../services/text-zoom/text-zoom.service';
import { PageRoutes } from '../../../shared/enums/page-routes';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { Theme } from '../../../shared/enums/theme';
import { StyleClass } from '../../../shared/enums/style-class';
import { BtnRoles } from '../../../shared/enums/btn-roles';
import { TextZoomSize } from '../../../shared/enums/text-zoom-size';
import { IImageResource } from '../../../shared/interfaces/models/image-resource';
import { WallpaperService } from '../../../services/wallpaper/wallpaper.service';

@Component({
  selector: 'app-theme-and-background',
  templateUrl: './theme-and-background.component.html',
  styleUrls: ['./theme-and-background.component.scss'],
  standalone: false
})
export class ThemeAndBackgroundComponent implements OnInit {

  themeMode!: Theme;
  textSize!: number;
  selectedBackground!: IImageResource | undefined;
  selectedAvatar!: IImageResource | undefined;

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;
  protected readonly Theme = Theme;
  protected readonly TextZoomSize = TextZoomSize;

  constructor(
    private themeService: ThemeService,
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService,
    private textZoomService: TextZoomService,
    private router: Router,
    private wallpaperService: WallpaperService,
  ) {
  }

  ngOnInit() {
    this.themeMode = this.themeService.getTheme();
    this.textSize = this.textZoomService.getCurrentZoom();
  }

  ionViewDidEnter() {
    this.loadCurrentWallpaper();
  }

  /**
   * onClickSwitchTheme
   */
  public onClickSwitchTheme() {
    const buttons: Array<ActionSheetButton> = [
      {
        text: this.translate.instant(TranslateKeys.TITLE_THEME_LIGHT),
        cssClass: this.themeMode === Theme.LIGHT ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.themeMode = Theme.LIGHT;
          this.themeService.enableLight();
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_THEME_DARK),
        cssClass: this.themeMode === Theme.DARK ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.themeMode = Theme.DARK;
          this.themeService.enableDark();
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_THEME_SYSTEM),
        cssClass: this.themeMode === Theme.SYSTEM ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.themeMode = Theme.SYSTEM;
          this.themeService.useSystemTheme();
        },
      },
      {
        text: this.translate.instant(TranslateKeys.BUTTON_CANCEL),
        role: BtnRoles.CANCEL,
      },
    ];
    this.actionSheetCtrl.create({buttons: buttons}).then(actionSheet => actionSheet.present());
  }

  /**
   * onClickSwitchTextSize
   */
  public onClickSwitchTextSize() {
    const buttons: Array<ActionSheetButton> = [
      {
        text: this.translate.instant(TranslateKeys.TITLE_TEXT_SIZE_SMALL),
        cssClass: this.textSize === TextZoomSize.SMALL ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.textSize = TextZoomSize.SMALL;
          this.textZoomService.setZoom(this.textSize);
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_TEXT_SIZE_MEDIUM),
        cssClass: this.textSize === TextZoomSize.MEDIUM ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.textSize = TextZoomSize.MEDIUM;
          this.textZoomService.setZoom(this.textSize);
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_TEXT_SIZE_LARGE),
        cssClass: this.textSize === TextZoomSize.LARGE ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.textSize = TextZoomSize.LARGE;
          this.textZoomService.setZoom(this.textSize);
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_TEXT_SIZE_BIG_SIZE),
        cssClass: this.textSize === TextZoomSize.BIG_SIZE ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.textSize = TextZoomSize.BIG_SIZE;
          this.textZoomService.setZoom(this.textSize);
        },
      },
      {
        text: this.translate.instant(TranslateKeys.BUTTON_CANCEL),
        role: BtnRoles.CANCEL,
      },
    ];
    this.actionSheetCtrl.create({buttons: buttons}).then(actionSheet => actionSheet.present());
  }

  /**
   * onClickWallpapers
   * @param isBackground
   */
  public onClickWallpapers(isBackground: boolean = false) {
    const navigationExtras: NavigationExtras = {state: {isBackground: isBackground}};
    return this.router.navigateByUrl(`${PageRoutes.PROFILE}/${PageRoutes.AVATAR_BACKGROUND}`, navigationExtras);
  }

  /**
   * loadCurrentWallpaper
   * @private
   */
  private loadCurrentWallpaper(): void {
    this.wallpaperService.getSelectedHomeImage().then((bg) => this.selectedBackground = bg);
    this.wallpaperService.getSelectedAvatar().then((avatar) => this.selectedAvatar = avatar);
  }
}
