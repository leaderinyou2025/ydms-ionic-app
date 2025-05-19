import { Component, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ThemeService } from '../../../services/theme/theme.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ForceTestData } from '../../../shared/classes/force-test-data';
import { TextZoomService } from '../../../services/text-zoom/text-zoom.service';
import { PageRoutes } from '../../../shared/enums/page-routes';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { Theme } from '../../../shared/enums/theme';
import { StyleClass } from '../../../shared/enums/style-class';
import { BtnRoles } from '../../../shared/enums/btn-roles';
import { TextZoomSize } from '../../../shared/enums/text-zoom-size';
import { WallpaperService } from '../../../services/wallpaper/wallpaper.service';
import { IAssetsResource } from '../../../shared/interfaces/settings/assets-resource';
import { IThemeSettings } from '../../../shared/interfaces/settings/theme-settings';

@Component({
  selector: 'app-theme-and-background',
  templateUrl: './theme-and-background.component.html',
  styleUrls: ['./theme-and-background.component.scss'],
  standalone: false
})
export class ThemeAndBackgroundComponent implements OnInit {

  themeSettings!: IThemeSettings;
  selectedBackground!: IAssetsResource | undefined;
  selectedAvatar!: IAssetsResource | undefined;

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
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.loadThemeSettings();
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
        cssClass: this.themeSettings.theme_model === Theme.LIGHT ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.themeSettings.theme_model = Theme.LIGHT;
          this.themeService.enableLight(false);
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_THEME_DARK),
        cssClass: this.themeSettings.theme_model === Theme.DARK ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.themeSettings.theme_model = Theme.DARK;
          this.themeService.enableDark(false);
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_THEME_SYSTEM),
        cssClass: this.themeSettings.theme_model === Theme.SYSTEM ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.themeSettings.theme_model = Theme.SYSTEM;
          this.themeService.useSystemTheme(false);
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
        cssClass: this.themeSettings.text_size === TextZoomSize.SMALL ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.themeSettings.text_size = TextZoomSize.SMALL;
          this.textZoomService.setZoom(this.themeSettings.text_size, false);
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_TEXT_SIZE_MEDIUM),
        cssClass: this.themeSettings.text_size === TextZoomSize.MEDIUM ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.themeSettings.text_size = TextZoomSize.MEDIUM;
          this.textZoomService.setZoom(this.themeSettings.text_size, false);
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_TEXT_SIZE_LARGE),
        cssClass: this.themeSettings.text_size === TextZoomSize.LARGE ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.themeSettings.text_size = TextZoomSize.LARGE;
          this.textZoomService.setZoom(this.themeSettings.text_size, false);
        },
      },
      {
        text: this.translate.instant(TranslateKeys.TITLE_TEXT_SIZE_BIG_SIZE),
        cssClass: this.themeSettings.text_size === TextZoomSize.BIG_SIZE ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.themeSettings.text_size = TextZoomSize.BIG_SIZE;
          this.textZoomService.setZoom(this.themeSettings.text_size, false);
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
    this.wallpaperService.getSelectedBackgroundImage().then((bg) => this.selectedBackground = bg);
    this.wallpaperService.getSelectedAvatar().then((avatar) => this.selectedAvatar = avatar);
  }

  /**
   * loadThemeSettings of user
   * @private
   */
  private loadThemeSettings(): void {
    this.authService.getThemeSettings().then((themeSettings) => {
      if (themeSettings) this.themeSettings = themeSettings;
    });
  }
}
