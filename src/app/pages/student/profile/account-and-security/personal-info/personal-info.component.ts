import { Component, OnInit } from '@angular/core';

import { IAuthData } from '../../../../../shared/interfaces/auth/auth-data';
import { AuthService } from '../../../../../services/auth/auth.service';
import { PageRoutes } from '../../../../../shared/enums/page-routes';
import { TranslateKeys } from '../../../../../shared/enums/translate-keys';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  standalone: false
})
export class PersonalInfoComponent implements OnInit {

  authData!: IAuthData | undefined;

  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.authService.getAuthData().then(authData => this.authData = authData);
  }

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;
}
