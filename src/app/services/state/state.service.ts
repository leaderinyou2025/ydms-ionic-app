import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _showLockScreen = new Subject<boolean>();
  public readonly showLockScreen$: Observable<boolean> = this._showLockScreen.asObservable();

  constructor() {
  }

  /**
   * Cập nhật trạng thái hiển thị màn hình khóa
   * @param isShow true = hiện, false = ẩn
   */
  public setShowLockScreen(isShow: boolean): void {
    this._showLockScreen.next(isShow);
  }

}
