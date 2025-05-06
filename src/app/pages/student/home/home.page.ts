import { Component } from '@angular/core';

import { AuthService } from '../../../services/auth/auth.service';
import { TranslateKeys } from '../../../shared/enums/translate-keys';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  imageUrl!: string;
  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private authService: AuthService,
  ) {
  }

  public onClickLogout(): void {
    this.authService.logout();
  }
}
