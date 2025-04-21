import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertButton, AlertController, AlertOptions, LoadingController, Platform, ToastButton, ToastController, ToastOptions } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { AvailableResult, BiometryType, NativeBiometric } from 'capacitor-native-biometric';
import { debounceTime, Subject } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { LiveUpdateService } from '../../services/live-update/live-update.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { AccountHistoryService } from '../../services/account-history/account-history.service';
import { StorageService } from '../../services/storage/storage.service';
import { StorageKey } from '../../shared/enums/storage-key';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { StyleClass } from '../../shared/enums/style-class';
import { NativePlatform } from '../../shared/enums/native-platform';
import { IAccountHistory } from '../../shared/interfaces/function-data/account-history';
import { IonicIcons } from '../../shared/enums/ionic-icons';
import { Position } from '../../shared/enums/position';
import { BtnRoles } from '../../shared/enums/btn-roles';
import { IonicColors } from '../../shared/enums/ionic-colors';
import { CommonConstants } from '../../shared/classes/common-constants';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  isReady!: boolean;
  loginForm!: FormGroup;
  defaultLang!: string;
  appVersion!: string;
  protected readonly TranslateKeys = TranslateKeys;

  // Auto complete account
  accountList: Array<IAccountHistory> = [];
  filteredAccounts: Array<IAccountHistory> = [];
  showSuggestions = false;
  private inputSubject = new Subject<string>();

  // Biometric
  biometricAvailable!: AvailableResult | undefined;
  hasCredentials!: boolean;
  isFaceID!: boolean;


  constructor(
    public platform: Platform,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private liveUpdateService: LiveUpdateService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private accountHistoryService: AccountHistoryService,
    private storageService: StorageService,
  ) {
  }

  ngOnInit() {
    this.isReady = false;
    this.initializeTranslation();
    this.initLoginForm();
    this.handleAccountAutocomplete();
  }

  ionViewDidEnter() {
    this.isReady = false;
    // Get live update app version
    this.liveUpdateService.getAppVersionString().then(appVersionString => this.appVersion = appVersionString);
    // Initial app
    setTimeout(() => this.initApp(), 1000);
  }

  /**
   * Initial app
   * @private
   */
  private async initApp(): Promise<void> {
    const loading = await this.loadingController.create({mode: 'md', message: 'Đang cập nhật dữ liệu...'});
    await loading.present();

    // Live update checking
    if (navigator.onLine) {
      await this.liveUpdateService.checkUpdateApp();
    }

    if (!this.platform.is('mobileweb') &&
      (this.platform.is('ios') || this.platform.is('android'))) {
      // Init biometric
      this.checkBiometricAvailable();
      // Firebase init
      await this.firebaseAddListener();
      await this.registerNotifications();
    } else {
      await this.storageService.set(StorageKey.FIREBASE_DEVICE_TOKEN, CommonConstants.randomString(256));
    }

    await loading.dismiss();

    // Check auth to redirect home page by user role
    if (this.authService.isAuthenticated()) {
      this.isReady = false;
      // TODO: Check user role and redirect to home page
      // await this.router.navigateByUrl();
      return;
    }

    this.isReady = true;
  }


  /**-------------------- Login form & login handle ------------------------*/

  /**
   * Handle onclick login button
   * @public
   */
  public async onClickLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.loginForm.value.remember) {
      const accountHistory: IAccountHistory = {
        username: this.loginForm.value.phone,
        password: this.loginForm.value.password,
      }
      await this.accountHistoryService.addAccount(accountHistory);
    } else {
      await this.accountHistoryService.removeAccount(this.loginForm.value.phone);
    }

    console.log('Form hợp lệ:', this.loginForm.value);
  }

  /**
   * Initialize login form
   * @private
   */
  private initLoginForm(): void {
    this.loginForm = new FormGroup({
      phone: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      remember: new FormControl(true, []),
    });
  }

  /**
   * Check has error of control
   * @param controlName
   * @param errorType
   */
  public hasError(controlName: string, errorType: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control?.hasError(errorType) && (control?.dirty || control?.touched));
  }


  /**-------------------- Firebase notification config ------------------------*/

  /**
   * Add listener push notification
   * @private
   */
  private async firebaseAddListener() {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
      // TODO: register FCM device token to server
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', JSON.stringify(notification));
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', JSON.stringify(notification));
    });
  }

  /**
   * Register notification native
   * @private
   */
  private async registerNotifications() {
    // Get permission status
    let permStatus = await PushNotifications.checkPermissions();

    // Request permission
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    // Register push notification
    if (permStatus.receive === 'granted') {
      await PushNotifications.register();
      return;
    }

    // Show alert to open setting
    const buttons: Array<AlertButton> = [
      {
        text: this.translate.instant(TranslateKeys.BUTTON_OPEN_SETTING),
        handler: () => this.openNativeSettings()
      },
      {text: this.translate.instant(TranslateKeys.BUTTON_CANCEL)}
    ];
    const alertOption: AlertOptions = {
      header: this.translate.instant(TranslateKeys.ALERT_DEFAULT_HEADER),
      buttons: buttons,
      message: this.translate.instant(TranslateKeys.COMMON_ACCESS_PERMISSION_NOTIFICATION_ALERT),
      animated: true,
      cssClass: StyleClass.INFO_ALERT,
      mode: NativePlatform.IOS
    };
    const alert = await this.alertController.create(alertOption);
    await alert.present();
  }

  /**
   * Open native setting
   * @private
   */
  private async openNativeSettings() {
    await NativeSettings.open({
      optionAndroid: AndroidSettings.ApplicationDetails,
      optionIOS: IOSSettings.App
    });
  }


  /**-------------------- Input account autocomplete ------------------------*/

  /**
   * On username input
   * @param event
   * @public
   */
  public onUsernameInput(event: any): void {
    const value = event.detail.value;
    if (!value?.length) {
      this.loginForm.get('password')?.setValue('')
    }
    this.inputSubject.next(value);
  }

  /**
   * On select username
   * @param acc
   * @public
   */
  public selectUsername(acc: IAccountHistory): void {
    this.loginForm.get('phone')?.setValue(acc?.username || '');
    this.loginForm.get('password')?.setValue(acc?.password || '');
    this.filteredAccounts = [];
    this.showSuggestions = false;
  }

  /**
   * Load and handle account autocomplete
   * @private
   */
  private async handleAccountAutocomplete(): Promise<void> {
    // Load saved account list
    this.accountList = await this.accountHistoryService.getAccountHistory();

    // Handle subject change input username
    this.inputSubject.pipe(debounceTime(500)).subscribe((input) => {
      if (input) {
        this.filteredAccounts = this.accountList.filter((acc) =>
          acc.username.toLowerCase().includes(input.toLowerCase())
        );
      } else {
        this.filteredAccounts = this.accountList;
      }
      this.showSuggestions = !!this.filteredAccounts.length;
    });
  }


  /**-------------------- TRANSLATION ---------------------------------------*/

  /**
   * On switch language
   * @param lang
   */
  public switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.localStorageService.set(StorageKey.LANGUAGE, lang);
  }

  /**
   * Init translation
   * @private
   */
  private initializeTranslation(): void {
    this.translate.addLangs(['en', 'vi']);
    this.defaultLang = this.localStorageService.get<string>(StorageKey.LANGUAGE) || 'vi';
    this.translate.resetLang(this.defaultLang);
    this.translate.use(this.defaultLang);
  }


  /**-------------------- BIOMETRIC ---------------------------------------*/

  /**
   * Login with biometric
   * @public
   */
  public onClickLoginBiometric() {
    if (!this.biometricAvailable) return;

    const username: string = this.loginForm.get('phone')?.value;
    const serverUser = `${environment.serverUrl}/${username}`;

    NativeBiometric.verifyIdentity({
      title: this.translate.instant(TranslateKeys.COMMON_AUTHENTICATION_TITLE),
      negativeButtonText: this.translate.instant(TranslateKeys.BUTTON_CANCEL),
      maxAttempts: 5
    }).then(() => {
      NativeBiometric.getCredentials({server: serverUser}).then(certificate => {
        if (certificate?.username && certificate?.password) {
          this.loginForm.get('phone')?.setValue(certificate.username);
          this.loginForm.get('password')?.setValue(certificate.password);
          // TODO: Handle login function
        }
      }).catch(() => {
        console.error('Can not get Credentials.');
        this.toastErrorBiometric();
        this.deleteUserCredentials(serverUser);
      });
    }).catch(() => {
      console.error('Permission denied.');
      this.toastErrorBiometric();
      this.deleteUserCredentials(serverUser);
    });
  }

  /**
   * Check available biometric
   * @private
   */
  private checkBiometricAvailable() {
    NativeBiometric.isAvailable().then(result => {
      this.biometricAvailable = result;
      this.isFaceID = (this.biometricAvailable.biometryType == BiometryType.FACE_ID);

      if (this.biometricAvailable?.isAvailable) {
        const username: string = this.loginForm.get('phone')?.value;
        const serverUser = `${environment.serverUrl}/${username}`;

        NativeBiometric.getCredentials({server: serverUser}).then(certificate => {
          if (certificate?.username != username) {
            this.hasCredentials = false;
            this.deleteUserCredentials(serverUser);
          } else {
            this.hasCredentials = (certificate?.username != null && certificate?.password != null);
          }
        });
      }
    });
  }

  /**
   * Delete user's credentials
   * @private
   */
  private deleteUserCredentials(serverUser: string) {
    NativeBiometric.deleteCredentials({server: serverUser}).finally(() => this.biometricAvailable = undefined);
  }

  /**
   * Open toast error biometric
   * @private
   */
  private toastErrorBiometric(): void {
    const closeBtn: ToastButton = {
      icon: IonicIcons.CLOSE_CIRCLE_OUTLINE,
      side: Position.END,
      role: BtnRoles.CANCEL,
    }
    const toastOption: ToastOptions = {
      header: this.translate.instant(TranslateKeys.TOAST_ERROR_HEADER),
      message: this.translate.instant(TranslateKeys.COMMON_AUTHENTICATION_BY_PASS_ALERT),
      duration: 5000,
      buttons: [closeBtn],
      mode: NativePlatform.IOS,
      cssClass: `${StyleClass.TOAST_ITEM} ${StyleClass.TOAST_ERROR}`,
      position: Position.TOP,
      icon: IonicIcons.WARNING_OUTLINE,
      color: IonicColors.DANGER,
      keyboardClose: false
    }
    this.toastController.create(toastOption).then(toast => toast.present());
  }
}
