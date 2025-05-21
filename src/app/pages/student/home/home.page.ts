import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertButton, AlertController, AlertInput, ToastButton, ToastController, ToastOptions } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AnimationOptions } from 'ngx-lottie';

import { AuthService } from '../../../services/auth/auth.service';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { StatusItemType } from '../../../shared/enums/home/status-item-type.enum';
import { ForceTestData } from '../../../shared/classes/force-test-data';
import { ICharacter, IProgress, IStatusItem, ITask, } from '../../../shared/interfaces/home/home.interfaces';
import { IAuthData } from '../../../shared/interfaces/auth/auth-data';
import { BtnRoles } from '../../../shared/enums/btn-roles';
import { IonicIcons } from '../../../shared/enums/ionic-icons';
import { Position } from '../../../shared/enums/position';
import { NativePlatform } from '../../../shared/enums/native-platform';
import { StyleClass } from '../../../shared/enums/style-class';
import { IonicColors } from '../../../shared/enums/ionic-colors';
import { PageRoutes } from '../../../shared/enums/page-routes';
import { LiyYdmsAvatarService } from '../../../services/models/iliy-ydms-avatar.service';
import { CommonConstants } from '../../../shared/classes/common-constants';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;

  // Animation option
  options: AnimationOptions = {
    path: '/assets/animations/1747072943680.json',
    loop: true,
    autoplay: true,
  };

  // User setting background and avatar
  authData?: IAuthData;
  background!: string;
  avatar?: string;

  /**
   * Character information
   */
  public character: ICharacter = {
    name: '',
    imagePath: '',
    altText: ''
  };

  /**
   * Status bar items
   */
  public statusItems: IStatusItem[] = [];

  /**
   * List of tasks to display
   */
  public tasks: ITask[] = [];

  /**
   * Progress information
   */
  public progress: IProgress = {
    completed: 0,
    total: 0,
    value: 0,
  };

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController,
    private translate: TranslateService,
    private router: Router,
    private liyYdmsAvatarService: LiyYdmsAvatarService,
  ) {
  }

  async ngOnInit() {
    await this.authService.loadUserProfile();
  }

  async ionViewDidEnter() {
    if (this.authData) {
      this.handleRefresh();
    } else {
      await this.loadHomeData();
    }
  }

  /**
   * On click open dialog to setting nickname
   */
  public onClickOpenSetNicknameDialog(): void {
    const nicknameInput: AlertInput = {
      type: 'text',
      name: 'nickname',
      placeholder: this.translate.instant(TranslateKeys.RANK_NICKNAME),
    };
    const buttons: Array<AlertButton> = [
      {text: this.translate.instant(TranslateKeys.BUTTON_CANCEL)},
      {
        text: this.translate.instant(TranslateKeys.BUTTON_OK),
        handler: (alertData) => this.updateUserNickname(alertData?.nickname)
      },
    ];
    this.alertController.create({
      header: this.translate.instant(TranslateKeys.TITLE_SETUP_NICKNAME),
      inputs: [nicknameInput],
      buttons: buttons,
    }).then(alert => alert.present());
  }

  /**
   * On click open setting avatar
   */
  public onClickSettingAvatar(): void {
    const navigationExtras: NavigationExtras = {state: {isBackground: false}};
    this.router.navigateByUrl(`${PageRoutes.PROFILE}/${PageRoutes.AVATAR_BACKGROUND}`, navigationExtras);
  }

  /**
   * Reload data
   * @param event
   */
  public handleRefresh(event?: CustomEvent): void {
    setTimeout(async () => {
      await this.authService.loadUserProfile();
      await this.loadHomeData();
      if (event) await (event.target as HTMLIonRefresherElement).complete();
    }, 500);
  }

  /**
   * Load all home screen data
   */
  private async loadHomeData(): Promise<void> {
    try {
      await Promise.all([this.loadUserProfileData(), this.loadTasksAndProgress()]);
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  }

  /**
   * Load student profile data
   */
  private async loadUserProfileData(): Promise<void> {
    this.authData = await this.authService.getAuthData();
    if (!this.authData) return;

    this.loadConfigAvatarAndBackground();
    this.statusItems = ForceTestData.statusItems;
  }

  /**
   * Load tasks and progress data
   */
  private async loadTasksAndProgress(): Promise<void> {
    const authData = await this.authService.getAuthData();
    if (!authData?.id) return;

    // Force test data
    this.progress = {completed: 1, total: 3, value: 0.33};
    this.tasks = ForceTestData.tasks;
  }

  /**
   * Get image path based on status item type
   * @param type The status item type
   * @returns The path to the image
   */
  public getImagePathByType(type: StatusItemType): string {
    switch (type) {
      case StatusItemType.BADGE:
        return 'assets/icons/svg/ico_top_achievement.svg';
      case StatusItemType.RANK:
        return 'assets/icons/svg/ico_top_rank.svg';
      case StatusItemType.MISSION:
        return 'assets/icons/svg/ico_top_mission.svg';
      case StatusItemType.FRIENDLY:
        return 'assets/icons/svg/ico_top_friendly.svg';
      default:
        return '';
    }
  }

  /**
   * Execute the selected task
   * @param task Data of the task to execute
   */
  public executeTask(task: ITask): void {

  }

  /**
   * Load user setting background and avatar image
   */
  public loadConfigAvatarAndBackground(): void {
    // Background image
    this.authService.getThemeSettings().then(themeSettings => {
      if (themeSettings?.background?.resource_url)
        this.background = `url(${themeSettings.background.resource_url})`;
    });

    // Avatar image
    this.authService.getAuthData().then(authData => {
      if (authData?.avatar?.id) {
        this.liyYdmsAvatarService.getImageById(authData.avatar.id).then(imageData => {
          const imgType = CommonConstants.detectMimeType(imageData?.image_512 || '');
          this.avatar = imgType ? `${imgType + imageData?.image_512}` : undefined;
        });
      }
    });
  }

  /**
   * Update user nickname for first time
   * @param nickname
   * @private
   */
  private updateUserNickname(nickname: string): void {
    if (!nickname) {
      return this.toastMessage(this.translate.instant(TranslateKeys.VALIDATE_NICKNAME_REQUIRED), true);
    }

    if (!this.authData) return;
    this.authData.nickname = nickname;
    this.authService.setAuthData(this.authData)
      .then(() => this.authService.saveUserProfile()
        .then((result) => this.toastMessage(
          this.translate.instant(result ? TranslateKeys.TOAST_UPDATE_SUCCESS : TranslateKeys.TOAST_UPDATE_FAILED), !result
        )));
  }

  /**
   * toastWarningMessage
   * @param msg
   * @param isWarning
   * @private
   */
  private toastMessage(msg: string, isWarning: boolean = false): void {
    this.toastController.getTop().then(popover => {
      const closeBtn: ToastButton = {
        icon: IonicIcons.CLOSE_CIRCLE_OUTLINE,
        side: Position.END,
        role: BtnRoles.CANCEL,
      }
      const toastOption: ToastOptions = {
        header: isWarning ? this.translate.instant(TranslateKeys.TOAST_WARNING_HEADER) : this.translate.instant(TranslateKeys.TOAST_SUCCESS_HEADER),
        message: msg,
        duration: 5000,
        buttons: [closeBtn],
        mode: NativePlatform.IOS,
        cssClass: `${StyleClass.TOAST_ITEM} ${isWarning ? StyleClass.TOAST_ERROR : StyleClass.TOAST_SUCCESS}`,
        position: Position.TOP,
        icon: isWarning ? IonicIcons.WARNING_OUTLINE : IonicIcons.CHECKMARK_CIRCLE_OUTLINE,
        color: isWarning ? IonicColors.WARNING : IonicColors.SUCCESS,
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
}
