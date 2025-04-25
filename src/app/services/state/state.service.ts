import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _showLockScreen = new Subject<boolean>();
  public readonly showLockScreen$: Observable<boolean> = this._showLockScreen.asObservable();

  private _verifyByBiometric = new Subject<void>();
  public readonly verifyByBiometric$: Observable<void> = this._verifyByBiometric.asObservable();

  constructor() {
  }

  /**
   * Cập nhật trạng thái hiển thị màn hình khóa
   * @param isShow true = hiện, false = ẩn
   */
  public setShowLockScreen(isShow: boolean): void {
    this._showLockScreen.next(isShow);
  }

  /**
   * Thông báo sự kiện app sau khi xác thực biometric
   */
  public verifyByBiometric(): void {
    this._verifyByBiometric.next();
  }

}
