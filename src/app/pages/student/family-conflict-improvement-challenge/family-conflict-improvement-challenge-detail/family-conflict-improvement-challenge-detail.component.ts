import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { FamilyConflictImprovementChallengeService } from '../../../../services/family-conflict-improvement-challenge/family-conflict-improvement-challenge.service';
import {
  IFamilyConflictImprovementChallengeDetail,
  ChallengeStatus
} from '../../../../shared/interfaces/family-conflict-improvement-challenge/family-conflict-improvement-challenge.interfaces';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../shared/enums/page-routes';
import { IonicColors } from '../../../../shared/enums/ionic-colors';

@Component({
  selector: 'app-family-conflict-improvement-challenge-detail',
  templateUrl: './family-conflict-improvement-challenge-detail.component.html',
  styleUrls: ['./family-conflict-improvement-challenge-detail.component.scss'],
  standalone: false,
})
export class FamilyConflictImprovementChallengeDetailComponent implements OnInit {
  challengeDetail: IFamilyConflictImprovementChallengeDetail | null = null;
  isLoading: boolean = true;
  challengeId: number = 0;

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;
  protected readonly ChallengeStatus = ChallengeStatus;

  constructor(
    private familyConflictImprovementChallengeService: FamilyConflictImprovementChallengeService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loadChallengeDetail();
  }

  /**
   * Load challenge detail
   */
  private async loadChallengeDetail(): Promise<void> {
    this.isLoading = true;

    try {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (!idParam) {
        throw new Error('Challenge ID is required');
      }

      this.challengeId = parseInt(idParam, 10);
      const challengeDetail = await this.familyConflictImprovementChallengeService.getChallengeDetail(this.challengeId);

      if (!challengeDetail) {
        throw new Error('Challenge not found');
      }

      this.challengeDetail = challengeDetail;
    } catch (error) {
      console.error('ERROR:', error);
      this.showToast(this.translate.instant(TranslateKeys.MESSAGE_ERROR_LOADING_DATA), IonicColors.DANGER);
      this.navigateBack();
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Navigate back to challenge list
   */
  public navigateBack(): void {
    this.router.navigate([`/${PageRoutes.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE}`]);
  }

  /**
   * Update challenge progress
   */
  public updateProgress(): void {
    if (this.challengeDetail && this.challengeDetail.status === ChallengeStatus.ACTIVE) {
      this.router.navigate([`/${PageRoutes.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE}/update`, this.challengeId]);
    } else {
      this.showToast(this.translate.instant(TranslateKeys.MESSAGE_CANNOT_UPDATE_INACTIVE_CHALLENGE), IonicColors.WARNING);
    }
  }

  /**
   * Abandon challenge
   */
  public async abandonChallenge(): Promise<void> {
    if (!this.challengeDetail || this.challengeDetail.status !== ChallengeStatus.ACTIVE) {
      this.showToast(this.translate.instant(TranslateKeys.MESSAGE_CANNOT_ABANDON_INACTIVE_CHALLENGE), IonicColors.WARNING);
      return;
    }

    const alert = await this.alertController.create({
      header: this.translate.instant(TranslateKeys.ALERT_CONFIRM_HEADER),
      message: this.translate.instant(TranslateKeys.ALERT_CONFIRM_ABANDON_CHALLENGE),
      buttons: [
        {
          text: this.translate.instant(TranslateKeys.BUTTON_CANCEL),
          role: 'cancel'
        },
        {
          text: this.translate.instant(TranslateKeys.ALERT_CONFIRM_HEADER),
          handler: async () => {
            const success = await this.familyConflictImprovementChallengeService.abandonChallenge(this.challengeId);

            if (success) {
              this.showToast(this.translate.instant(TranslateKeys.MESSAGE_CHALLENGE_ABANDONED), IonicColors.SUCCESS);
              this.loadChallengeDetail();
            } else {
              this.showToast(this.translate.instant(TranslateKeys.MESSAGE_ERROR_ABANDONING_CHALLENGE), IonicColors.DANGER);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Get status color based on challenge status
   * @param status Challenge status
   */
  public getStatusColor(status: ChallengeStatus): string {
    switch (status) {
      case ChallengeStatus.ACTIVE:
        return 'primary';
      case ChallengeStatus.COMPLETED:
        return 'success';
      case ChallengeStatus.ABANDONED:
        return 'medium';
      default:
        return 'primary';
    }
  }

  /**
   * Get status text based on challenge status
   * @param status Challenge status
   */
  public getStatusText(status: ChallengeStatus): string {
    switch (status) {
      case ChallengeStatus.ACTIVE:
        return this.translate.instant(TranslateKeys.STATUS_ACTIVE);
      case ChallengeStatus.COMPLETED:
        return this.translate.instant(TranslateKeys.STATUS_COMPLETED);
      case ChallengeStatus.ABANDONED:
        return this.translate.instant(TranslateKeys.STATUS_ABANDONED);
      default:
        return this.translate.instant(TranslateKeys.STATUS_ACTIVE);
    }
  }

  /**
   * Format date
   * @param date Date to format
   */
  public formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  /**
   * Show toast message
   * @param message Message to display
   * @param color Toast color
   */
  private async showToast(message: string, color: IonicColors): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
}
