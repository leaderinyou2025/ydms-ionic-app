import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
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
  selector: 'app-family-conflict-improvement-challenge-update',
  templateUrl: './family-conflict-improvement-challenge-update.component.html',
  styleUrls: ['./family-conflict-improvement-challenge-update.component.scss'],
  standalone: false,
})
export class FamilyConflictImprovementChallengeUpdateComponent implements OnInit {
  challengeDetail: IFamilyConflictImprovementChallengeDetail | null = null;
  isLoading: boolean = true;
  challengeId: number = 0;
  progressValue: number = 0;
  progressNotes: string = '';

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private familyConflictImprovementChallengeService: FamilyConflictImprovementChallengeService,
    private route: ActivatedRoute,
    private router: Router,
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

      if (challengeDetail.status !== ChallengeStatus.ACTIVE) {
        this.showToast(this.translate.instant(TranslateKeys.MESSAGE_CANNOT_UPDATE_INACTIVE_CHALLENGE), IonicColors.WARNING);
        this.navigateToDetail();
        return;
      }

      this.challengeDetail = challengeDetail;
      this.progressValue = challengeDetail.progress;
    } catch (error) {
      console.error('ERROR:', error);
      this.showToast(this.translate.instant(TranslateKeys.MESSAGE_ERROR_LOADING_DATA), IonicColors.DANGER);
      this.navigateBack();
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Update challenge progress
   */
  public async updateProgress(): Promise<void> {
    if (!this.challengeDetail) {
      return;
    }

    if (!this.progressNotes.trim()) {
      this.showToast(this.translate.instant(TranslateKeys.MESSAGE_ENTER_PROGRESS_NOTES), IonicColors.WARNING);
      return;
    }

    try {
      const success = await this.familyConflictImprovementChallengeService.updateChallengeProgress(
        this.challengeId,
        this.progressValue,
        this.progressNotes
      );

      if (success) {
        this.showToast(this.translate.instant(TranslateKeys.MESSAGE_PROGRESS_UPDATED), IonicColors.SUCCESS);
        this.navigateToDetail();
      } else {
        throw new Error('Failed to update progress');
      }
    } catch (error) {
      console.error('ERROR:', error);
      this.showToast(this.translate.instant(TranslateKeys.MESSAGE_ERROR_UPDATING_PROGRESS), IonicColors.DANGER);
    }
  }

  /**
   * Navigate back to challenge list
   */
  public navigateBack(): void {
    this.router.navigate([`/${PageRoutes.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE}`]);
  }

  /**
   * Navigate to challenge detail
   */
  public navigateToDetail(): void {
    this.router.navigate([`/${PageRoutes.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE}/${this.challengeId}`]);
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
