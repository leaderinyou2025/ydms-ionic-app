import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { FamilyConflictImprovementChallengeService } from '../../../../services/family-conflict-improvement-challenge/family-conflict-improvement-challenge.service';
import { IFamilyConflictImprovementChallengeGoal } from '../../../../shared/interfaces/family-conflict-improvement-challenge/family-conflict-improvement-challenge.interfaces';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../shared/enums/page-routes';
import { IonicColors } from '../../../../shared/enums/ionic-colors';

@Component({
  selector: 'app-family-conflict-improvement-challenge-new',
  templateUrl: './family-conflict-improvement-challenge-new.component.html',
  styleUrls: ['./family-conflict-improvement-challenge-new.component.scss'],
  standalone: false,
})
export class FamilyConflictImprovementChallengeNewComponent implements OnInit {
  challengeGoals: IFamilyConflictImprovementChallengeGoal[] = [];
  isLoading: boolean = true;
  selectedGoalId: number | null = null;
  customGoal: string = '';
  useCustomGoal: boolean = false;

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private familyConflictImprovementChallengeService: FamilyConflictImprovementChallengeService,
    private router: Router,
    private toastController: ToastController,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loadChallengeGoals();
  }

  /**
   * Load challenge goals
   */
  private loadChallengeGoals(): void {
    this.isLoading = true;

    this.familyConflictImprovementChallengeService.getChallengeGoals().subscribe(
      goals => {
        this.challengeGoals = goals;
        this.isLoading = false;
      },
      error => {
        console.error('ERROR:', error);
        this.isLoading = false;
        this.showToast(this.translate.instant(TranslateKeys.MESSAGE_ERROR_LOADING_DATA), IonicColors.DANGER);
      }
    );
  }

  /**
   * Toggle between predefined goals and custom goal
   */
  public toggleGoalType(): void {
    // Reset selections when switching
    if (this.useCustomGoal) {
      this.selectedGoalId = null;
    } else {
      this.customGoal = '';
    }
  }

  /**
   * Select a goal
   * @param goalId Goal ID
   */
  public selectGoal(goalId: number): void {
    this.selectedGoalId = goalId;
  }

  /**
   * Create new challenge
   */
  public async createChallenge(): Promise<void> {
    try {
      if (this.useCustomGoal && !this.customGoal.trim()) {
        this.showToast(this.translate.instant(TranslateKeys.MESSAGE_ENTER_CUSTOM_GOAL), IonicColors.WARNING);
        return;
      }

      if (!this.useCustomGoal && !this.selectedGoalId) {
        this.showToast(this.translate.instant(TranslateKeys.MESSAGE_SELECT_GOAL), IonicColors.WARNING);
        return;
      }

      const newChallenge = await this.familyConflictImprovementChallengeService.createNewChallenge(
        this.useCustomGoal ? undefined : this.selectedGoalId || undefined,
        this.useCustomGoal ? this.customGoal : undefined
      );

      if (newChallenge) {
        this.showToast(this.translate.instant(TranslateKeys.MESSAGE_CHALLENGE_CREATED), IonicColors.SUCCESS);
        this.router.navigate([`/${PageRoutes.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE}/${newChallenge.id}`]);
      } else {
        throw new Error('Failed to create challenge');
      }
    } catch (error) {
      console.error('ERROR:', error);
      this.showToast(this.translate.instant(TranslateKeys.MESSAGE_ERROR_CREATING_CHALLENGE), IonicColors.DANGER);
    }
  }

  /**
   * Navigate back to challenge list
   */
  public navigateBack(): void {
    this.router.navigate([`/${PageRoutes.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE}`]);
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
