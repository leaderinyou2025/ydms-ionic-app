import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll, RefresherCustomEvent, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FamilyConflictImprovementChallengeService } from '../../../services/family-conflict-improvement-challenge/family-conflict-improvement-challenge.service';
import { IFamilyConflictImprovementChallengeHistory, ChallengeStatus } from '../../../shared/interfaces/family-conflict-improvement-challenge/family-conflict-improvement-challenge.interfaces';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../shared/enums/page-routes';
import { IonicColors } from '../../../shared/enums/ionic-colors';
import { IHeaderAnimeImage } from "../../../shared/interfaces/header/header";

@Component({
  selector: 'app-family-conflict-improvement-challenge',
  templateUrl: './family-conflict-improvement-challenge.page.html',
  styleUrls: ['./family-conflict-improvement-challenge.page.scss'],
  standalone: false,
})
export class FamilyConflictImprovementChallengePage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  animeImage!: IHeaderAnimeImage;
  challengeHistory: IFamilyConflictImprovementChallengeHistory[] = [];
  displayedItems: IFamilyConflictImprovementChallengeHistory[] = [];
  isLoading: boolean = true;
  itemsPerPage: number = 10;
  currentIndex: number = 0;
  hasMoreItems: boolean = true;

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;
  protected readonly ChallengeStatus = ChallengeStatus;

  constructor(
    private familyConflictImprovementChallengeService: FamilyConflictImprovementChallengeService,
    private translate: TranslateService,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.initHeader();
    this.loadChallengeHistory();
  }

  /**
   * Initialize header animation image
   */
  private initHeader(): void {
    this.animeImage = {
      imageUrl: 'assets/images/family-conflict-survey.webp',
      name: 'Family Conflict Improvement Challenge',
      width: '120px',
      height: '120px',
      position: {
        position: 'absolute',
        right: '-10px',
        bottom: '-10px',
      }
    };
  }

  /**
   * Load challenge history
   */
  private async loadChallengeHistory(event?: RefresherCustomEvent): Promise<void> {
    // Only show loading skeleton if not refreshing
    if (!event) {
      this.isLoading = true;
    }

    this.currentIndex = 0;
    this.displayedItems = [];
    this.hasMoreItems = true;

    try {
      await this.familyConflictImprovementChallengeService.loadChallengeHistory();
      this.familyConflictImprovementChallengeService.getChallengeHistory().subscribe(history => {
        this.challengeHistory = history;
        this.loadMoreItems();

        // Complete the refresh event if it exists
        if (event) {
          event.target.complete();
        }

        this.isLoading = false;
      });
    } catch (error) {
      console.error('ERROR:', error);
      this.isLoading = false;

      // Complete the refresh event if it exists
      if (event) {
        event.target.complete();
      }

      this.showToast(this.translate.instant(TranslateKeys.MESSAGE_ERROR_LOADING_DATA), IonicColors.DANGER);
    }
  }

  /**
   * Load more items for infinite scroll
   */
  public loadMoreItems(event?: any): void {
    if (this.currentIndex >= this.challengeHistory.length) {
      this.hasMoreItems = false;
      if (event) {
        event.target.complete();
      }
      return;
    }

    const itemsToAdd = this.challengeHistory.slice(
      this.currentIndex,
      this.currentIndex + this.itemsPerPage
    );

    this.displayedItems = [...this.displayedItems, ...itemsToAdd];
    this.currentIndex += this.itemsPerPage;

    if (this.currentIndex >= this.challengeHistory.length) {
      this.hasMoreItems = false;
    }

    if (event) {
      event.target.complete();
    }
  }

  /**
   * Handle pull-to-refresh
   * @param event Refresh event
   */
  public doRefresh(event: RefresherCustomEvent): void {
    // Show loading indicator
    this.isLoading = true;

    // Small delay to show loading state
    setTimeout(() => {
      this.loadChallengeHistory(event);
    }, 300);
  }

  /**
   * View challenge detail
   * @param challengeId Challenge ID
   */
  public viewChallengeDetail(challengeId: number): void {
    this.router.navigate([`/${PageRoutes.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE}`, challengeId]);
  }

  /**
   * Create new challenge
   */
  public createNewChallenge(): void {
    this.router.navigate([`/${PageRoutes.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE}/new`]);
  }

  /**
   * Update challenge progress
   */
  public updateChallengeProgress(): void {
    // Find the first active challenge
    const activeChallenge = this.challengeHistory.find(c => c.status === ChallengeStatus.ACTIVE);

    if (activeChallenge) {
      this.router.navigate([`/${PageRoutes.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE}/update`, activeChallenge.id]);
    } else {
      this.showToast(this.translate.instant(TranslateKeys.MESSAGE_NO_ACTIVE_CHALLENGES), IonicColors.WARNING);
    }
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
