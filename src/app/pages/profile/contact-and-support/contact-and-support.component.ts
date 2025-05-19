import { Component, OnInit } from '@angular/core';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../shared/enums/page-routes';

@Component({
  selector: 'app-contact-and-support',
  templateUrl: './contact-and-support.component.html',
  styleUrls: ['./contact-and-support.component.scss'],
  standalone: false
})
export class ContactAndSupportComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
}
