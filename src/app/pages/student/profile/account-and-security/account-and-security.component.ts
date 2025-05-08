import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../shared/enums/page-routes';
import { Theme } from '../../../../shared/enums/theme';
import { StorageKey } from '../../../../shared/enums/storage-key';
import { IAuthData } from '../../../../shared/interfaces/auth/auth-data';
import { AuthService } from '../../../../services/auth/auth.service';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-account-and-security',
  templateUrl: './account-and-security.component.html',
  styleUrls: ['./account-and-security.component.scss'],
  standalone: false
})
export class AccountAndSecurityComponent  implements OnInit {

  authData!: IAuthData | undefined;
  isAppLockEnabled = false;

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
  protected readonly Theme = Theme;

  constructor(
    public router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.authService.getAuthData().then(authData => this.authData = authData);
    this.loadAppLockStatus();
  }

  /**
   * Load app lock status
   */
  private loadAppLockStatus() {
    this.isAppLockEnabled = this.localStorageService.get<boolean>(StorageKey.APP_LOCK_ENABLE) || false;
  }


}
