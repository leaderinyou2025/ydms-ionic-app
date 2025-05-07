import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {
  LoadingController,
  NavController,
  ToastButton,
  ToastController,
  ToastOptions
} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

import {TranslateKeys} from '../../../../../shared/enums/translate-keys';
import {PageRoutes} from '../../../../../shared/enums/page-routes';
import {AuthService} from '../../../../../services/auth/auth.service';
import {NativePlatform} from '../../../../../shared/enums/native-platform';
import {StyleClass} from '../../../../../shared/enums/style-class';
import {IonicColors} from '../../../../../shared/enums/ionic-colors';
import {IonicIcons} from '../../../../../shared/enums/ionic-icons';
import {Position} from '../../../../../shared/enums/position';
import {BtnRoles} from '../../../../../shared/enums/btn-roles';
import {HttpClientService} from "../../../../../services/http-client/http-client.service";
import {environment} from "../../../../../../environments/environment.prod";
import {RequestPayload} from "../../../../../shared/classes/request-payload";
import {OdooJsonrpcServiceNames} from "../../../../../shared/enums/odoo-jsonrpc-service-names";
import {OdooMethodName} from "../../../../../shared/enums/odoo-method-name";
import {CommonConstants} from "../../../../../shared/classes/common-constants";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: false
})
export class ChangePasswordComponent implements OnInit {
  public passwordForm!: FormGroup;
  public isSubmitting = false;
  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private navCtrl: NavController,
    private translate: TranslateService,
    private httpClientService: HttpClientService,
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  /**
   * Initialize password change form
   * @private
   */
  private initForm(): void {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator()
    });
  }

  /**
   * Custom validator to check if passwords match
   * @private
   */
  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !(control instanceof FormGroup)) return null;

      const newPassword = control.get('newPassword')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;

      if (newPassword !== confirmPassword) {
        control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  /**
   * Check if form control has error
   * @param controlName
   * @param errorType
   */
  public hasError(controlName: string, errorType: string): boolean {
    if (!this.passwordForm) return false;
    const control = this.passwordForm.get(controlName);
    return !!(control?.hasError(errorType) && (control?.dirty || control?.touched));
  }

  /**
   * Handle form submission
   */
  public async onSubmit(): Promise<void> {
    if (this.passwordForm.invalid) {
      if (this.passwordForm) this.passwordForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const loading = await this.loadingController.create({mode: NativePlatform.IOS});
    await loading.present();

    try {
      const currentPassword = this.passwordForm.get('currentPassword')?.value;
      const newPassword = this.passwordForm.get('newPassword')?.value;

      const changePasswordResult = await this.authService.changePassword(currentPassword, newPassword);

      if (!changePasswordResult) {
        this.showToast(this.translate.instant('ERROR.invalid_current_password'), IonicColors.DANGER);
        return;
      }

      this.authService.saveAuthToken(newPassword);

      this.showToast(this.translate.instant('TOAST.password_changed_success'), IonicColors.SUCCESS);

      await this.navCtrl.navigateBack(`/${PageRoutes.PROFILE}/${PageRoutes.ACCOUNT_AND_SECURITY}`);
    } catch (error) {
      console.error('Error changing password:', error);
      this.showToast(this.translate.instant(TranslateKeys.ERROR_UNKNOWN), IonicColors.DANGER)
    } finally {
      await loading.dismiss();
      this.isSubmitting = false;
    }
  }

  /**
   * Show toast message
   * @param message
   * @param color
   * @private
   */
  private showToast(message: string, color: IonicColors.SUCCESS | IonicColors.DANGER): void {
    const closeBtn: ToastButton = {
      icon: IonicIcons.CLOSE_CIRCLE_OUTLINE,
      side: Position.END,
      role: BtnRoles.CANCEL,
    }
    const toastOption: ToastOptions = {
      message,
      duration: 5000,
      buttons: [closeBtn],
      mode: NativePlatform.IOS,
      cssClass: `${StyleClass.TOAST_ITEM} ${color === IonicColors.DANGER ? StyleClass.TOAST_ERROR : StyleClass.TOAST_SUCCESS}`,
      position: Position.TOP,
      icon: color === IonicColors.DANGER ? IonicIcons.WARNING_OUTLINE : IonicIcons.CHECKMARK_CIRCLE_OUTLINE,
      color,
      keyboardClose: false
    }
    this.toastController.create(toastOption).then(toast => toast.present());
  }

}
