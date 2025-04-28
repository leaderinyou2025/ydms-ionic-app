import { Injectable } from '@angular/core';
import { AlertController, AlertOptions, Platform, ToastButton, ToastController, ToastOptions } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

import { SoundService } from '../sound/sound.service';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { NativePlatform } from '../../shared/enums/native-platform';
import { StyleClass } from '../../shared/enums/style-class';
import { environment } from '../../../environments/environment';
import { NotificationPayload } from '@firebase/messaging';
import { IonicIcons } from '../../shared/enums/ionic-icons';
import { Position } from '../../shared/enums/position';
import { BtnRoles } from '../../shared/enums/btn-roles';
import { IonicColors } from '../../shared/enums/ionic-colors';
import { SoundKeys } from '../../shared/enums/sound-keys';


@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private firebaseApp: any;
  private messaging: any;

  constructor(
    private alertController: AlertController,
    private translate: TranslateService,
    private platform: Platform,
    private toastController: ToastController,
    private soundService: SoundService,
  ) {
  }

  /**
   * Init push notifications
   */
  async init() {
    if (!this.platform.is('mobileweb') && (this.platform.is('android') || this.platform.is('ios'))) {
      await this.registerNotifications();
      this.addListeners();
    } else {
      this.initFirebaseWebPush();
    }
  }

  /**
   * Web / PWA push
   */
  private initFirebaseWebPush() {
    console.info('Initializing Firebase Web Push');
    const firebaseConfig = environment.firebaseConfig;
    const vapidKey = environment.webPushPublicKey;

    this.firebaseApp = initializeApp(firebaseConfig);
    this.messaging = getMessaging(this.firebaseApp);

    // Check push notification permission
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (!registration) console.warn('No service worker registration found. Push Notification may fail.');
    });

    /**
     * Register firebase token
     */
    getToken(this.messaging, {vapidKey}).then((token) => {
      if (token) {
        console.log('Registration token (web):', token);
        this.registerDeviceTokenToServer(token);
      } else {
        console.warn('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.error('An error occurred while retrieving token (web): ', err);
    });

    /**
     * On message
     */
    onMessage(this.messaging, (payload) => {
      if (payload.notification) this.toastFirebaseMessage(payload.notification);
    });
  }

  /**
   * Open toast firebase message
   * @private
   */
  private toastFirebaseMessage(notification: NotificationPayload): void {
    this.toastController.getTop().then(popover => {
      const closeBtn: ToastButton = {
        icon: IonicIcons.CLOSE_CIRCLE_OUTLINE,
        side: Position.END,
        role: BtnRoles.CANCEL,
      }
      const toastOption: ToastOptions = {
        header: notification.title,
        message: notification.body,
        duration: 5000,
        buttons: [closeBtn],
        mode: NativePlatform.IOS,
        cssClass: `${StyleClass.TOAST_ITEM} ${StyleClass.TOAST_INFO}`,
        position: Position.TOP,
        icon: IonicIcons.INFORMATION_CIRCLE_OUTLINE,
        color: IonicColors.PRIMARY,
        keyboardClose: false
      }

      if (!popover) {
        this.toastController.create(toastOption).then(toast => toast.present().finally(() => this.soundService.playEffect(SoundKeys.NOTIFICATION)));
      } else {
        // Close current toast before show new toast
        this.toastController.dismiss().then(() => this.toastController.create(toastOption).then(toast => toast.present().finally(() => this.soundService.playEffect(SoundKeys.NOTIFICATION))));
      }
    });
  }

  /**
   * Register notification permission
   * @private
   */
  private async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive === 'granted') {
      await PushNotifications.register();
    } else {
      await this.showOpenSettingAlert();
    }
  }

  /**
   * Add listeners for push notifications
   * @private
   */
  private addListeners() {
    // Đăng ký notification token với firebase
    PushNotifications.addListener('registration', (token: Token) => {
      console.info('Registration token: ', token.value);
      this.registerDeviceTokenToServer(token.value);
    });

    // Lỗi đăng ký notification token với firebase
    PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    // Khi nhận được notification ở foreground
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', JSON.stringify(notification));
    });

    // Khi user click vào notification.
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed: ', JSON.stringify(notification));
      // Xử lý logic khi user click vào notification
    });
  }

  /**
   * Register device token to server
   * @param token
   * @private
   */
  private registerDeviceTokenToServer(token: string) {
    // TODO: Call API to register FCM device token to server
  }

  /**
   * Show alert to open settings
   * @private
   */
  private async showOpenSettingAlert() {
    const buttons = [
      {
        text: this.translate.instant(TranslateKeys.BUTTON_OPEN_SETTING),
        handler: () => this.openNativeSettings()
      },
      {text: this.translate.instant(TranslateKeys.BUTTON_CANCEL)}
    ];

    const alertOption: AlertOptions = {
      header: this.translate.instant(TranslateKeys.ALERT_DEFAULT_HEADER),
      message: this.translate.instant(TranslateKeys.COMMON_ACCESS_PERMISSION_NOTIFICATION_ALERT),
      buttons,
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
}
