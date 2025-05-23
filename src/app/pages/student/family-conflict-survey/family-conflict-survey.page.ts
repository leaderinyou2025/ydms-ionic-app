import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll, InfiniteScrollCustomEvent, RefresherCustomEvent, ToastButton, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FamilyConflictSurveyService } from '../../../services/family-conflict-survey/family-conflict-survey.service';
import { IFamilyConflictSurveyHistory, IFamilyConflictSurveyDetail } from '../../../shared/interfaces/family-conflict-survey/family-conflict-survey.interfaces';
import { ILiyYdmsAssessmentResult } from '../../../shared/interfaces/models/liy.ydms.assessment.result';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../shared/enums/page-routes';

import { IonicColors } from '../../../shared/enums/ionic-colors';
import { IonicIcons } from '../../../shared/enums/ionic-icons';
import { BtnRoles } from '../../../shared/enums/btn-roles';
import { NativePlatform } from '../../../shared/enums/native-platform';
import { StyleClass } from '../../../shared/enums/style-class';
import {IHeaderAnimeImage} from "../../../shared/interfaces/header/header";

@Component({
  selector: 'app-family-conflict-survey',
  templateUrl: './family-conflict-survey.page.html',
  styleUrls: ['./family-conflict-survey.page.scss'],
  standalone: false,
})
export class FamilyConflictSurveyPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  animeImage!: IHeaderAnimeImage;
  surveyHistory: IFamilyConflictSurveyHistory[] = [];
  displayedItems: IFamilyConflictSurveyHistory[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  hasMoreItems: boolean = false;

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private familyConflictSurveyService: FamilyConflictSurveyService,
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
  private loadSurveyHistory(event?: RefresherCustomEvent): void {
    if (!event) {
      this.isLoading = true;
    }

    this.currentPage = 1;
    this.displayedItems = [];

    this.familyConflictSurveyService.getSurveyHistory().subscribe(
      (history) => {
        this.surveyHistory = history;
        this.totalPages = Math.ceil(this.surveyHistory.length / this.itemsPerPage);
        this.loadInitialItems();
        this.isLoading = false;

        if (event) {
          event.target.complete();
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
    this.hasMoreItems = this.currentPage < this.totalPages;
  }

  /**
   * Get items for a specific page
   * @param page Page number
   */
  private getItemsForPage(page: number): IFamilyConflictSurveyHistory[] {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.surveyHistory.slice(startIndex, endIndex);
  }

  /**
   * Load more items when scrolling down
   * @param event Infinite scroll event
   */
  public loadMore(event: InfiniteScrollCustomEvent): void {
    if (this.isLoading) {
      event.target.complete();
      return;
    }

    // Ngừng load thêm khi đã đến trang cuối cùng
    if (this.currentPage >= this.totalPages) {
      event.target.complete();
      this.hasMoreItems = false;
      return;
    }

    this.currentPage++;
    const newItems = this.getItemsForPage(this.currentPage);
    this.displayedItems = [...this.displayedItems, ...newItems];

    // Check if there are more items to load
    this.hasMoreItems = this.currentPage < this.totalPages;

    event.target.complete();
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
  public viewSurveyDetail(surveyId: number | undefined): void {
    if (surveyId) {
      this.router.navigate([`/${PageRoutes.FAMILY_CONFLICT_SURVEY}`, surveyId]);
    }
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
   * init header
   * @private
   */
  private initHeader(): void {
    this.animeImage = {
      name: 'rank',
      imageUrl: '/assets/images/family-conflict-survey.webp',
      width: '130px',
      height: 'auto',
      position: {
        position: 'absolute',
        right: '-20px',
        bottom: '-10px'
      }
    };
  }
}
