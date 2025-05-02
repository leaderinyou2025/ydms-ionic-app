import { Component, OnInit } from '@angular/core';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../shared/enums/page-routes';

@Component({
  selector: 'app-notification-and-sound',
  templateUrl: './notification-and-sound.component.html',
  styleUrls: ['./notification-and-sound.component.scss'],
  standalone: false
})
export class NotificationAndSoundComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
}
