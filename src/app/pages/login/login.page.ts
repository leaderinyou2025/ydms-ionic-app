import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertButton, AlertController, AlertOptions, LoadingController, NavController, Platform, ToastButton, ToastController, ToastOptions } from '@ionic/angular';
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
import { PageRoutes } from '../../shared/enums/page-routes';
import { LanguageKeys } from '../../shared/enums/language-keys';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  isReady!: boolean;
  loginForm!: FormGroup;
  defaultLang!: string | undefined;
  appVersion!: string;
  protected readonly TranslateKeys = TranslateKeys;
  protected readonly LanguageKeys = LanguageKeys;
  deviceHeight!: string;

  // Auto complete account
  accountList: Array<IAccountHistory> = [];
  filteredAccounts: Array<IAccountHistory> = [];
  showSuggestions = false;
  private inputSubject = new Subject<string>();

  // Biometric
  biometricAvailable!: AvailableResult | undefined;
  hasCredentials!: boolean;
  isFaceID!: boolean;
  isEnableBiometric!: boolean | undefined;


  constructor(
    public platform: Platform,
    private authService: AuthService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private liveUpdateService: LiveUpdateService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private accountHistoryService: AccountHistoryService,
    private storageService: StorageService,
    private navCtrl: NavController
  ) {
  }

  ngOnInit() {
    this.isReady = false;
    this.platform.ready().then(() => this.deviceHeight = `${this.platform.height()}px`);
    this.initializeTranslation();
  }

  ionViewDidEnter() {
    this.isReady = false;
    // Get live update app version
    this.liveUpdateService.getAppVersionString().then(appVersionString => this.appVersion = appVersionString);
    // Initial app
    setTimeout(() => this.initApp(), 500);
  }

  /**
   * Initial app
   * @private
   */
  private async initApp(): Promise<void> {
    const loading = await this.loadingController.create({
      mode: NativePlatform.IOS,
      message: this.translate.instant(TranslateKeys.COMMON_DATA_UPDATING)
    });
    await loading.present();

    // Live update checking
    if (navigator.onLine) {
      await this.liveUpdateService.checkUpdateApp();
    }

    if (!this.platform.is(NativePlatform.MOBILEWEB) &&
      (this.platform.is(NativePlatform.IOS) || this.platform.is(NativePlatform.ANDROID))) {
      // Firebase init
      await this.firebaseAddListener();
      await this.registerNotifications();
    } else {
      await this.storageService.set(StorageKey.FIREBASE_DEVICE_TOKEN, CommonConstants.randomString(256));
    }

    await loading.dismiss();

    // Check user is authenticated to redirect home page
    if (this.authService.isAuthenticated()) {
      this.isReady = false;
      // TODO: Check user role and redirect to home page
      // await this.router.navigateByUrl();
      await this.navCtrl.navigateRoot(`/${PageRoutes.HOME}`, {replaceUrl: true});
      return;
    }

    // Init login form and handle autocomplete input account
    this.initLoginForm();
    await this.handleAccountAutocomplete();

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

    await this.handleLogin();
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
   * Handle call api to auth user
   * @private
   */
  private async handleLogin(): Promise<void> {
    // Show loading
    const loading = await this.loadingController.create({mode: 'ios'});
    await loading.present();

    // Call API login and get user profile
    const loginResult = await this.authService.login(
      this.loginForm.value.phone,
      this.loginForm.value.password
    );

    // Close loading
    await loading.dismiss();

    // Login error, show error toast and end process
    if (!loginResult) {
      this.toastErrorLogin();

      // Clear biometric credentials
      if (this.hasCredentials) {
        this.hasCredentials = false;
        this.deleteUserCredentials(`${environment.serverUrl}/${this.loginForm.value.phone}`);
      }

      // End process
      return;
    }

    /*----------- Login success ------------------*/

    // TEST: Test login by biometric
    this.localStorageService.set(StorageKey.ENABLE_BIOMETRIC, true);
    if (this.platform.is(NativePlatform.MOBILEWEB)) {
      await NativeBiometric.setCredentials({server: `${environment.serverUrl}/0964164434`, username: '0964164434', password: '12345678'});
      this.localStorageService.set<AvailableResult>(StorageKey.BIOMETRIC_AVAILABLE_RESULT, {
        isAvailable: true,
        biometryType: BiometryType.TOUCH_ID,
      });
    }
    // TEST: Test unlock app
    this.localStorageService.set(StorageKey.APP_LOCK_ENABLE, true);
    this.localStorageService.set(StorageKey.APP_LOCK_TIMEOUT, 0);
    this.localStorageService.set(StorageKey.APP_UNLOCK_BIOMETRIC_ENABLE, true);
    await this.storageService.set(StorageKey.APP_LOCK_PIN, '0000');

    // Remember account handle
    if (this.loginForm.value.remember) {
      const accountHistory: IAccountHistory = {
        username: this.loginForm.value.phone,
        created_at: Date.now(),
        updated_at: Date.now()
      }
      await this.accountHistoryService.addAccount(accountHistory);
    }

    // TODO: Login success check role to redirect home page
    await this.navCtrl.navigateRoot(`/${PageRoutes.HOME}`, {replaceUrl: true});
  }

  /**
   * Open toast error login
   * @private
   */
  private toastErrorLogin(): void {
    this.toastController.getTop().then(popover => {
      const closeBtn: ToastButton = {
        icon: IonicIcons.CLOSE_CIRCLE_OUTLINE,
        side: Position.END,
        role: BtnRoles.CANCEL,
      }
      const toastOption: ToastOptions = {
        header: this.translate.instant(TranslateKeys.TOAST_WARNING_HEADER),
        message: this.translate.instant(TranslateKeys.COMMON_AUTH_FAILED),
        duration: 5000,
        buttons: [closeBtn],
        mode: NativePlatform.IOS,
        cssClass: `${StyleClass.TOAST_ITEM} ${StyleClass.TOAST_ERROR}`,
        position: Position.TOP,
        icon: IonicIcons.WARNING_OUTLINE,
        color: IonicColors.WARNING,
        keyboardClose: false
      }

      if (!popover) {
        this.toastController.create(toastOption).then(toast => toast.present());
      } else {
        // Close current toast before show new toast
        this.toastController.dismiss().then(() => this.toastController.create(toastOption).then(toast => toast.present()))
      }
    });
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
    this.hasCredentials = false;
    this.inputSubject.next(value);
  }

  /**
   * On select username
   * @param acc
   * @public
   */
  public selectUsername(acc: IAccountHistory): void {
    this.loginForm.get('phone')?.setValue(acc?.username || '');
    this.filteredAccounts = [];
    this.showSuggestions = false;
    this.hasCredentials = false;
    if (acc?.username) this.checkBiometricAvailable();
  }

  /**
   * Load and handle account autocomplete
   * @private
   */
  private async handleAccountAutocomplete(): Promise<void> {
    // Load saved account list
    const accountList = await this.accountHistoryService.getAccountHistory();
    this.accountList = accountList.sort((a, b) => b.updated_at - a.updated_at);
    if (this.accountList.length > 0) {
      this.loginForm.get('phone')?.setValue(this.accountList[0].username);
      this.checkBiometricAvailable();
    }

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
    if (lang === this.defaultLang) return;
    this.defaultLang = lang;
    this.translate.use(lang);
    this.updateLanguageFlag();
    this.localStorageService.set(StorageKey.LANGUAGE, lang);
  }

  /**
   * Init translation
   * @private
   */
  private initializeTranslation(): void {
    this.defaultLang = this.localStorageService.get<string>(StorageKey.LANGUAGE);
    if (this.defaultLang !== LanguageKeys.VN) setTimeout(() => this.updateLanguageFlag(), 100);
  }

  /**
   * Update flag image icon
   * @private
   */
  private updateLanguageFlag(): void {
    const selectElement = document.querySelector('.switch-lang-container');
    if (selectElement instanceof HTMLElement) {
      const flagUrl = this.defaultLang === LanguageKeys.VN ? CommonConstants.languageFlagImageUrls.vn : CommonConstants.languageFlagImageUrls.en;
      selectElement.style.backgroundImage = `url(${flagUrl})`;
    }
  }


  /**-------------------- BIOMETRIC ---------------------------------------*/

  /**
   * Login with biometric
   * @public
   */
  public async onClickLoginBiometric() {
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
          this.handleLogin();
        }
      }).catch(() => {
        console.error('Can not get biometric credentials.');
        this.toastErrorBiometric();
        this.deleteUserCredentials(serverUser);
      });
    }).catch(() => {
      console.error('Biometric permission denied.');
      this.toastErrorBiometric();
      this.deleteUserCredentials(serverUser);
    });
  }

  /**
   * Check available biometric
   * @private
   */
  private checkBiometricAvailable(): void {
    this.isEnableBiometric = this.localStorageService.get<boolean>(StorageKey.ENABLE_BIOMETRIC);
    if (this.platform.is('mobileweb') || (!this.platform.is('ios') && !this.platform.is('android'))) return;

    NativeBiometric.isAvailable().then(result => {
      this.biometricAvailable = result;
      this.isFaceID = (this.biometricAvailable.biometryType == BiometryType.FACE_ID);
      this.localStorageService.set(StorageKey.BIOMETRIC_AVAILABLE_RESULT, result);
      this.hasCredentials = false;

      if (this.biometricAvailable?.isAvailable) {
        const username: string = this.loginForm.get('phone')?.value;
        const serverUser = `${environment.serverUrl}/${username}`;

        NativeBiometric.getCredentials({server: serverUser}).then(certificate => {
          this.hasCredentials = (certificate?.username != null && certificate?.username === username && certificate?.password != null);
          if (certificate?.username && !certificate?.password) {
            this.deleteUserCredentials(serverUser);
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
