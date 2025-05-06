import { Component, OnInit } from '@angular/core';
import { PageRoutes } from '../../../../../shared/enums/page-routes';
import { TranslateKeys } from '../../../../../shared/enums/translate-keys';

@Component({
  selector: 'app-app-lock-settings',
  templateUrl: './app-lock-settings.component.html',
  styleUrls: ['./app-lock-settings.component.scss'],
  standalone: false
})
export class AppLockSettingsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;
}
