import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { SelfDiscoverySurveyService } from '../../../services/self-discovery-survey/self-discovery-survey.service';
import { ISelfDiscoverySurveyHistory } from '../../../shared/interfaces/self-discovery-survey/self-discovery-survey.interfaces';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../shared/enums/page-routes';
import { ForceTestData } from '../../../shared/classes/force-test-data';
import { IonicColors } from '../../../shared/enums/ionic-colors';
import {IHeaderAnimeImage} from "../../../shared/interfaces/header/header";

@Component({
  selector: 'app-self-discovery-survey',
  templateUrl: './self-discovery-survey.page.html',
  styleUrls: ['./self-discovery-survey.page.scss'],
  standalone: false,
})
export class SelfDiscoverySurveyPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  animeImage!: IHeaderAnimeImage;
  surveyHistory: ISelfDiscoverySurveyHistory[] = [];
  displayedItems: ISelfDiscoverySurveyHistory[] = [];
  isLoading: boolean = true;
  itemsPerPage: number = 10;
  currentIndex: number = 0;
  hasMoreItems: boolean = true;

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private selfDiscoverySurveyService: SelfDiscoverySurveyService,
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
   */
  private async loadSurveyHistory(): Promise<void> {
    this.isLoading = true;

    try {
      this.selfDiscoverySurveyService.getSurveyHistory().subscribe(history => {
        this.surveyHistory = history;
        this.displayedItems = [];
        this.currentIndex = 0;
        this.hasMoreItems = this.surveyHistory.length > 0;
        this.loadInitialItems();
        this.isLoading = false;
      });
    } catch (error) {
      console.error('ERROR:', error);
      this.isLoading = false;
    }
  }

  /**
   * Load initial items
   */
  private loadInitialItems(): void {
    if (this.surveyHistory.length === 0) return;

    const itemsToLoad = Math.min(this.itemsPerPage, this.surveyHistory.length);
    this.displayedItems = this.surveyHistory.slice(0, itemsToLoad);
    this.currentIndex = itemsToLoad;
    this.hasMoreItems = this.currentIndex < this.surveyHistory.length;
  }

  /**
   * Load more items (for infinite scroll)
   * @param event Infinite scroll event
   */
  public loadMore(event: any): void {
    if (this.currentIndex >= this.surveyHistory.length) {
      this.hasMoreItems = false;
      event.target.complete();
      return;
    }

    setTimeout(() => {
      const remainingItems = this.surveyHistory.length - this.currentIndex;
      const itemsToLoad = Math.min(this.itemsPerPage, remainingItems);
      const newItems = this.surveyHistory.slice(this.currentIndex, this.currentIndex + itemsToLoad);

      this.displayedItems = [...this.displayedItems, ...newItems];
      this.currentIndex += itemsToLoad;

      this.hasMoreItems = this.currentIndex < this.surveyHistory.length;
      event.target.complete();
    }, 500);
  }

  /**
   * Pull to refresh
   * @param event Refresh event
   */
  public doRefresh(event: any): void {
    this.isLoading = true;
    setTimeout(() => {
      this.loadSurveyHistory();
      event.target.complete();
    }, 300);
  }

  /**
   * View survey detail
   * @param surveyId Survey ID
   */
  public viewSurveyDetail(surveyId: number): void {
    this.router.navigate([`/${PageRoutes.SELF_DISCOVERY_SURVEY}/${surveyId}`]);
  }

  /**
   * Create new survey
   */
  public async createNewSurvey(): Promise<void> {
    // This is just UI, no logic implementation as per requirements
    this.showToast(this.translate.instant(TranslateKeys.MESSAGE_FEATURE_UNDER_DEVELOPMENT), IonicColors.PRIMARY);
  }

  /**
   * Format date
   * @param date Date
   */
  public formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get discovery level emoji
   * @param discoveryLevel Discovery level
   */
  public getDiscoveryLevelEmoji(discoveryLevel: string): string {
    return ForceTestData.getDiscoveryLevelEmoji(discoveryLevel);
  }

  /**
   * Show toast
   * @param message Message
   * @param color Color
   */
  private async showToast(message: string, color: IonicColors): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });

    await toast.present();
  }

  /**
   * init header
   * @private
   */
  private initHeader(): void {
    this.animeImage = {
      name: 'rank',
      imageUrl: '/assets/images/self-discovery-survey.png',
      width: '180px',
      height: 'auto',
      position: {
        position: 'absolute',
        right: '-20px',
        bottom: '-5px'
      }
    };
  }
}
