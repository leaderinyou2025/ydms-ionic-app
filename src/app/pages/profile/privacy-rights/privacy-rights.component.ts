import { Component, OnInit } from '@angular/core';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../shared/enums/page-routes';

@Component({
  selector: 'app-privacy-rights',
  templateUrl: './privacy-rights.component.html',
  styleUrls: ['./privacy-rights.component.scss'],
  standalone: false
})
export class PrivacyRightsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
}
