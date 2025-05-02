import { Component, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../services/auth/auth.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { IAuthData } from '../../shared/interfaces/auth/auth-data';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { PageRoutes } from '../../shared/enums/page-routes';
import { BtnRoles } from '../../shared/enums/btn-roles';
import { LanguageKeys } from '../../shared/enums/language-keys';
import { StorageKey } from '../../shared/enums/storage-key';
import { StyleClass } from '../../shared/enums/style-class';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  authData!: IAuthData | undefined;
  currentLang!: string;

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;
  protected readonly LanguageKeys = LanguageKeys;

  constructor(
    public authService: AuthService,
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit() {
    this.currentLang = this.localStorageService.get<string>(StorageKey.LANGUAGE) || LanguageKeys.VN;
    this.authService.getAuthData().then(authData => this.authData = authData);
  }

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


}
