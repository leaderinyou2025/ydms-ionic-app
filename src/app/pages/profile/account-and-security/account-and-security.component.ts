import { Component, OnInit } from '@angular/core';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../shared/enums/page-routes';

@Component({
  selector: 'app-account-and-security',
  templateUrl: './account-and-security.component.html',
  styleUrls: ['./account-and-security.component.scss'],
  standalone: false
})
export class AccountAndSecurityComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
}
