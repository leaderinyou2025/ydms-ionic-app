import { Component, OnInit } from '@angular/core';
import { TranslateKeys } from '../../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../../shared/enums/page-routes';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: false
})
export class ChangePasswordComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
}
