import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { PageRoutes } from '../../enums/page-routes';
import { KeyboardService } from '../../../services/keyboard/keyboard.service';
import { TranslateKeys } from '../../enums/translate-keys';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false
})
export class FooterComponent implements OnInit, OnDestroy {

  protected readonly PageRoutes = PageRoutes;
  isKeyboardShowing!: boolean;
  private keyboardSubscription!: Subscription;

  constructor(
    private router: Router,
    private keyboardService: KeyboardService,
  ) {
  }

  ngOnInit() {
    this.keyboardSubscription = this.keyboardService.isKeyboardOpen$.subscribe((isKeyboardShowing) => this.isKeyboardShowing = isKeyboardShowing);
  }

  ngOnDestroy() {
    this.keyboardSubscription?.unsubscribe();
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  protected readonly TranslateKeys = TranslateKeys;
}
