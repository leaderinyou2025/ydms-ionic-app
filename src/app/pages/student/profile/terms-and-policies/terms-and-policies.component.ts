import { Component, OnInit } from '@angular/core';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../shared/enums/page-routes';

@Component({
  selector: 'app-terms-and-policies',
  templateUrl: './terms-and-policies.component.html',
  styleUrls: ['./terms-and-policies.component.scss'],
  standalone: false
})
export class TermsAndPoliciesComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
}
