import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll, RefresherCustomEvent, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FamilyCommunicationQualitySurveyService } from '../../../services/family-communication-quality-survey/family-communication-quality-survey.service';
import { IFamilyCommunicationQualitySurveyHistory, IFamilyCommunicationQualitySurveyDetail } from '../../../shared/interfaces/family-communication-quality-survey/family-communication-quality-survey.interfaces';
import { FamilyCommunicationQualitySurveyDetailComponent } from './family-communication-quality-survey-detail/family-communication-quality-survey-detail.component';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../shared/enums/page-routes';
import { ForceTestData } from '../../../shared/classes/force-test-data';
import { IonicColors } from '../../../shared/enums/ionic-colors';
import { IonicIcons } from '../../../shared/enums/ionic-icons';
import { BtnRoles } from '../../../shared/enums/btn-roles';
import { NativePlatform } from '../../../shared/enums/native-platform';
import { StyleClass } from '../../../shared/enums/style-class';
import {IHeaderAnimeImage} from "../../../shared/interfaces/header/header";

@Component({
  selector: 'app-family-communication-quality-survey',
  templateUrl: './family-communication-quality-survey.page.html',
  styleUrls: ['./family-communication-quality-survey.page.scss'],
  standalone: false,
})
export class FamilyCommunicationQualitySurveyPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  animeImage!: IHeaderAnimeImage;
  surveyHistory: IFamilyCommunicationQualitySurveyHistory[] = [];
  displayedItems: IFamilyCommunicationQualitySurveyHistory[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  hasMoreItems: boolean = true;

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private familyCommunicationQualitySurveyService: FamilyCommunicationQualitySurveyService,
    private router: Router,
    private translate: TranslateService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.initHeader();
    this.loadSurveyHistory();
  }

  /**
   * Load survey history
   */
  private loadSurveyHistory(event?: RefresherCustomEvent): void {
    // Only show loading skeleton if not refreshing
    if (!event) {
      this.isLoading = true;
    }

    this.currentPage = 1;
    this.displayedItems = [];
    this.hasMoreItems = true;

    this.familyCommunicationQualitySurveyService.getSurveyHistory().subscribe(
      (history) => {
        this.surveyHistory = history;
        this.totalItems = this.surveyHistory.length;

        // Tải dữ liệu trước khi ẩn loading
        const startIndex = 0;
        const endIndex = Math.min(this.itemsPerPage, this.surveyHistory.length);
        this.displayedItems = this.surveyHistory.slice(startIndex, endIndex);
        this.currentPage = 2; // Đã tải trang đầu tiên

        // Đặt isLoading = false sau khi đã có dữ liệu để hiển thị
        this.isLoading = false;

        if (event) {
          event.target.complete();
        }

        // Reset infinite scroll
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
   * Get displayed items
   */
  public getDisplayedItems(): IFamilyCommunicationQualitySurveyHistory[] {
    return this.displayedItems;
  }

  /**
   * Load more items for infinite scroll
   */
  public loadMoreItems(event?: any): void {
    setTimeout(() => {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = Math.min(startIndex + this.itemsPerPage, this.surveyHistory.length);
      const newItems = this.surveyHistory.slice(startIndex, endIndex);

      this.displayedItems = [...this.displayedItems, ...newItems];
      this.currentPage++;

      if (event) {
        event.target.complete();

        // Disable infinite scroll if all items are loaded
        if (this.displayedItems.length >= this.surveyHistory.length) {
          event.target.disabled = true;
          this.hasMoreItems = false;
        }
      }
    }, 800);
  }

  /**
   * Handle pull to refresh
   */
  public handleRefresh(event: RefresherCustomEvent): void {
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
    this.router.navigate([`/${PageRoutes.FAMILY_COMMUNICATION_QUALITY_SURVEY}/${surveyId}`]);
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
      year: 'numeric'
    });
  }

  /**
   * Get communication level emoji
   * @param communicationLevel Communication level
   */
  public getCommunicationLevelEmoji(communicationLevel: string): string {
    return ForceTestData.getCommunicationLevelEmoji(communicationLevel);
  }

  /**
   * Show toast message
   * @param message Message to display
   * @param color Toast color
   */
  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
      buttons: [
        {
          text: 'OK',
          role: BtnRoles.CANCEL,
        }
      ]
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
      imageUrl: '/assets/images/family-communication-quality-survey.png',
      width: '180px',
      height: 'auto',
      position: {
        position: 'absolute',
        right: '-20px',
        bottom: '-10px'
      }
    };
  }
}
