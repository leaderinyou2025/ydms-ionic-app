import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll, RefresherCustomEvent, ToastButton, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { EmotionalSurveyService } from '../../../services/emotional-survey/emotional-survey.service';
import { IEmotionalSurveyHistory, IEmotionalSurveyDetail } from '../../../shared/interfaces/emotional-survey/emotional-survey.interfaces';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../shared/enums/page-routes';
import { getEmotionEmoji } from '../../../shared/data/emotion-options.data';
import { IonicColors } from '../../../shared/enums/ionic-colors';
import { IonicIcons } from '../../../shared/enums/ionic-icons';
import { BtnRoles } from '../../../shared/enums/btn-roles';
import { NativePlatform } from '../../../shared/enums/native-platform';
import { StyleClass } from '../../../shared/enums/style-class';
import { EmotionType } from "../../../shared/enums/personal-diary/personal-diary.enum";
import { IHeaderAnimeImage } from "../../../shared/interfaces/header/header";

@Component({
  selector: 'app-emotional-survey',
  templateUrl: './emotional-survey.page.html',
  styleUrls: ['./emotional-survey.page.scss'],
  standalone: false,
})
export class EmotionalSurveyPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  animeImage!: IHeaderAnimeImage;
  surveyHistory: IEmotionalSurveyHistory[] = [];
  displayedItems: IEmotionalSurveyHistory[] = [];
  isLoading: boolean = true;
  itemsPerPage: number = 10;
  currentPage: number = 1;
  hasMoreItems: boolean = true;

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private emotionalSurveyService: EmotionalSurveyService,
    private translate: TranslateService,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.initHeader();
    this.loadSurveyHistory();
  }

  /**
   * Load survey history
   * @param event Optional refresh event
   */
  private loadSurveyHistory(event?: RefresherCustomEvent): void {
    if (!event) {
      this.isLoading = true;
    }

    // Reset pagination
    this.currentPage = 1;
    this.displayedItems = [];
    this.hasMoreItems = true;

    this.emotionalSurveyService.getSurveyHistory().subscribe(
      (history) => {
        this.surveyHistory = history;
        this.loadInitialItems();
        this.isLoading = false;

        if (event) {
          event.target.complete();
        }

        // Reset infinite scroll if it exists
        if (this.infiniteScroll) {
          this.infiniteScroll.disabled = false;
        }
      },
      (error) => {
        console.error('ERROR:', error);
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
        this.showToast(this.translate.instant('ERROR.server'), IonicColors.DANGER);
      }
    );
  }

  /**
   * Load initial items for the first page
   */
  private loadInitialItems(): void {
    const initialItems = this.getItemsForPage(1);
    this.displayedItems = [...initialItems];
    this.hasMoreItems = this.currentPage < Math.ceil(this.surveyHistory.length / this.itemsPerPage);
  }

  /**
   * Get items for a specific page
   * @param page Page number
   */
  private getItemsForPage(page: number): IEmotionalSurveyHistory[] {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.surveyHistory.slice(startIndex, endIndex);
  }

  /**
   * Load more items when scrolling down
   * @param event Infinite scroll event
   */
  public loadMore(event: any): void {
    if (this.currentPage >= Math.ceil(this.surveyHistory.length / this.itemsPerPage)) {
      event.target.complete();
      this.hasMoreItems = false;
      return;
    }

    setTimeout(() => {
      this.currentPage++;
      const newItems = this.getItemsForPage(this.currentPage);
      this.displayedItems = [...this.displayedItems, ...newItems];

      event.target.complete();

      // Check if there are more items to load
      this.hasMoreItems = this.currentPage < Math.ceil(this.surveyHistory.length / this.itemsPerPage);
    }, 500);
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
      this.loadSurveyHistory(event);
    }, 300);
  }

  /**
   * View survey detail
   * @param surveyId Survey ID
   */
  public viewSurveyDetail(surveyId: number): void {
    this.router.navigate([`/${PageRoutes.EMOTIONAL_SURVEY}/${surveyId}`]);
  }

  /**
   * Create new survey
   */
  public async createNewSurvey(): Promise<void> {
    // This is just UI, no logic implementation as per requirements
    this.showToast('Tính năng đang được phát triển', IonicColors.PRIMARY);
  }



  /**
   * Format date
   * @param date Date
   */
  public formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Get emotion emoji
   * @param emotionType Emotion type
   */
  public getEmotionEmoji(emotionType: string): string {
    return getEmotionEmoji(emotionType as EmotionType);
  }

  /**
   * Show toast message
   * @param message Message
   * @param color Color
   */
  private async showToast(message: string, color: IonicColors.SUCCESS | IonicColors.DANGER | IonicColors.WARNING | IonicColors.PRIMARY): Promise<void> {
    const closeBtn: ToastButton = {
      icon: IonicIcons.CLOSE_CIRCLE_OUTLINE,
      side: 'end',
      role: BtnRoles.CANCEL,
    };

    const toast = await this.toastController.create({
      message,
      duration: 3000,
      buttons: [closeBtn],
      mode: NativePlatform.IOS,
      cssClass: `${StyleClass.TOAST_ITEM} ${(color === IonicColors.DANGER || color === IonicColors.WARNING) ? StyleClass.TOAST_ERROR : (color === IonicColors.PRIMARY ? StyleClass.TOAST_INFO : StyleClass.TOAST_SUCCESS)}`,
      position: 'top',
      icon: (color === IonicColors.DANGER || color === IonicColors.WARNING) ? IonicIcons.WARNING_OUTLINE : (color === IonicColors.PRIMARY ? IonicIcons.INFORMATION_CIRCLE_OUTLINE : IonicIcons.CHECKMARK_CIRCLE_OUTLINE),
      color,
      keyboardClose: false
    });

    await toast.present();
  }

  /**
   * Initialize header configuration
   * @private
   */
  private initHeader(): void {
    this.animeImage = {
      name: 'emotional-survey',
      imageUrl: '/assets/images/emotional-survey.png',
      width: '80px',
      height: 'auto',
      position: {
        position: 'absolute',
        right: '-5px',
        bottom: '0'
      }
    };
  }
}
