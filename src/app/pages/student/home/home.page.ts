import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AnimationOptions } from 'ngx-lottie';

import { AuthService } from '../../../services/auth/auth.service';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { StatusItemType } from '../../../shared/enums/home/status-item-type.enum';
import { ForceTestData } from '../../../shared/classes/force-test-data';
import { IStatusItem, ITask, ICharacter, IProgress, } from '../../../shared/interfaces/home/home.interfaces';
import { OdooService } from '../../../services/odoo/odoo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  protected readonly TranslateKeys = TranslateKeys;

  options: AnimationOptions = {
    path: '/assets/animations/1747072943680.json',
    loop: true,
    autoplay: true,
  };

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
    private odooService: OdooService,
    private toastController: ToastController
  ) {
  }

  async ngOnInit() {
    await this.loadHomeData();
  }

  /**
   * Load all home screen data
   */
  private async loadHomeData(): Promise<void> {
    try {
      await Promise.all([
        this.loadUserProfileData(),
        this.loadTasksAndProgress()
      ]);
    } catch (error) {
      console.error('Error loading home data:', error);
      // Show error toast
      const toast = await this.toastController.create({
        message: 'Failed to load data. Please try again.',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  /**
   * Load student profile data including character and status items
   */
  private async loadUserProfileData(): Promise<void> {
    const authData = await this.authService.getAuthData();
    if (!authData?.id) return;

    // Get student home profile data
    // const profileData = await this.odooService.read(
    //   ModelName.STUDENT_HOME_PROFILE,
    //   [authData.id],
    //   [
    //     // Character fields
    //     'character_name',
    //     'character_image',
    //     'character_alt_text',
    //     // Status fields
    //     'badge_count',
    //     'rank',
    //     'mission_count',
    //     'friendly_points'
    //   ]
    // );
    //
    // if (profileData?.length) {
    //   const profile = profileData[0];
    //
    //   // Set character data
    //   this.character = {
    //     name: profile.character_name,
    //     imagePath: profile.character_image,
    //     altText: profile.character_alt_text
    //   };
    //
    //   // Set status items
    //   this.statusItems = [
    //     {
    //       type: StatusItemType.BADGE,
    //       value: profile.badge_count,
    //       label: 'Huy hiệu',
    //     },
    //     {
    //       type: StatusItemType.RANK,
    //       value: profile.rank,
    //       label: 'Xếp hạng',
    //     },
    //     {
    //       type: StatusItemType.MISSION,
    //       value: profile.mission_count,
    //       label: 'Nhiệm vụ',
    //     },
    //     {
    //       type: StatusItemType.FRIENDLY,
    //       value: profile.friendly_points,
    //       label: 'Thân thiện',
    //     }
    //   ];
    // }

    // Force test data
    this.character = ForceTestData.character;
    this.statusItems = ForceTestData.statusItems;
  }

  /**
   * Load tasks and progress data
   */
  private async loadTasksAndProgress(): Promise<void> {
    const authData = await this.authService.getAuthData();
    if (!authData?.id) return;

    // Get student tasks and progress
    // const userData = await this.odooService.read(
    //   ModelName.STUDENT_HOME_TASK,
    //   [authData.id],
    //   [
    //     'tasks',
    //     'completed_tasks',
    //     'total_tasks'
    //   ]
    // );
    //
    // if (userData?.length) {
    //   const user = userData[0];
    //
    //   // Set progress data
    //   const completed = user.completed_tasks || 0;
    //   const total = user.total_tasks || 0;
    //
    //   this.progress = {
    //     completed,
    //     total,
    //     value: total > 0 ? completed / total : 0,
    //   };
    //
    //   // Get task details if available
    //   if (user.tasks?.length) {
    //     const taskDetails = await this.odooService.read(
    //       ModelName.TASKS,
    //       user.tasks,
    //       ['id', 'description', 'points']
    //     );
    //
    //     if (taskDetails?.length) {
    //       this.tasks = taskDetails;
    //     }
    //   }
    // }

    // Force test data
    this.progress = {
      completed: 1,
      total: 3,
      value: 0.33,
    };
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
        return 'assets/images/badge.webp';
      case StatusItemType.RANK:
        return 'assets/images/rank.png';
      case StatusItemType.MISSION:
        return 'assets/images/lighting.png';
      case StatusItemType.FRIENDLY:
        return 'assets/images/heart.png';
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

}
