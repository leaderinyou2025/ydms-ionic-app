import { Component, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, AlertController, AlertOptions, LoadingController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../services/auth/auth.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { LiveUpdateService } from '../../services/live-update/live-update.service';
import { IAuthData } from '../../shared/interfaces/auth/auth-data';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { PageRoutes } from '../../shared/enums/page-routes';
import { BtnRoles } from '../../shared/enums/btn-roles';
import { LanguageKeys } from '../../shared/enums/language-keys';
import { StorageKey } from '../../shared/enums/storage-key';
import { StyleClass } from '../../shared/enums/style-class';
import { NativePlatform } from '../../shared/enums/native-platform';
import { CommonConstants } from '../../shared/classes/common-constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  authData!: IAuthData | undefined;
  currentLang!: LanguageKeys;
  currentAppVersion!: string;

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;
  protected readonly LanguageKeys = LanguageKeys;
  protected readonly NativePlatform = NativePlatform;

  constructor(
    public authService: AuthService,
    public platform: Platform,
    private loadingController: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private liveUpdateService: LiveUpdateService,
    private alertController: AlertController,
  ) {
  }

  ngOnInit() {
    this.currentLang = this.localStorageService.get<LanguageKeys>(StorageKey.LANGUAGE) || LanguageKeys.VN;
    this.authService.getAuthData().then(authData => this.authData = authData);
    this.liveUpdateService.getAppVersionString().then(currentAppVersion => this.currentAppVersion = currentAppVersion);
  }

  /**
   * On click to change language
   */
  public onClickSwitchLanguage(): void {
    const buttons: Array<ActionSheetButton> = [
      {
        text: this.translate.instant(TranslateKeys.COMMON_ENGLISH),
        cssClass: this.currentLang === LanguageKeys.EN ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.currentLang = LanguageKeys.EN;
          this.translate.use(LanguageKeys.EN);
          this.localStorageService.set(StorageKey.LANGUAGE, LanguageKeys.EN);
        },
      },
      {
        text: this.translate.instant(TranslateKeys.COMMON_VIETNAMESE),
        cssClass: this.currentLang === LanguageKeys.VN ? StyleClass.SELECTED_BUTTON : '',
        handler: () => {
          this.currentLang = LanguageKeys.VN;
          this.translate.use(LanguageKeys.VN);
          this.localStorageService.set(StorageKey.LANGUAGE, LanguageKeys.VN);
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
   * On click to check update app
   */
  public onClickUpdateApp(): void {
    this.loadingController.create({mode: NativePlatform.IOS}).then(loading => {
      loading.present();
      this.liveUpdateService.checkUpdateApp().then(result => {
        if (!result) {
          this.alertController.create({
            header: this.translate.instant(TranslateKeys.ALERT_DEFAULT_HEADER),
            message: this.translate.instant(TranslateKeys.ALERT_APP_UPDATE_SUCCESSFUL),
            cssClass: `${StyleClass.ERROR_ALERT} ${StyleClass.TEXT_JUSTIFY}`,
            buttons: [{text: this.translate.instant(TranslateKeys.BUTTON_CLOSE)}],
          }).then(alertItem => alertItem.present());
        }
      }).finally(() => loading.dismiss());
    });
  }

  /**
   * Get user avatar image
   */
  public getUserAvatarImage(): string | undefined {
    if (!this.authData) return;
    if (this.authData.is_teenager) {
      if (!this.authData.avatar_512) return '/assets/images/avatar/conan_no_set.png';
      const prefix = CommonConstants.detectMimeType(this.authData.avatar_512);
      if (!prefix) return '/assets/images/avatar/conan_no_set.png';
      return prefix + this.authData.avatar_512;
    } else {
      if (!this.authData.image_128) return '/assets/icons/svg/avatar.svg';
      const prefix = CommonConstants.detectMimeType(this.authData.image_128);
      if (!prefix) return '/assets/icons/svg/avatar.svg';
      return prefix + this.authData.image_128;
    }
  }
}
