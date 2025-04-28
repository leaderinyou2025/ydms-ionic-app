import { Injectable, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private isKeyboardOpenSubject = new BehaviorSubject<boolean>(false);
  public isKeyboardOpen$ = this.isKeyboardOpenSubject.asObservable();

  constructor(
    private ngZone: NgZone,
    private platform: Platform
  ) {
    if (!this.platform.is('mobileweb') && (this.platform.is('android') || this.platform.is('ios'))) this.initKeyboardListeners();
  }

  /**
   * Initial native keyboard listeners
   * @private
   */
  private initKeyboardListeners() {
    Keyboard.addListener('keyboardWillShow', () => {
      this.ngZone.run(() => {
        this.isKeyboardOpenSubject.next(true);
      });
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.ngZone.run(() => {
        this.isKeyboardOpenSubject.next(false);
      });
    });
  }

  /**
   * Check keyboard is opening
   */
  public isKeyboardOpen(): boolean {
    return this.isKeyboardOpenSubject.value;
  }
}
