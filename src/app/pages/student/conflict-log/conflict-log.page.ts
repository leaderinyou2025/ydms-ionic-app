import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll, RefresherCustomEvent, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ConflictLogService } from '../../../services/conflict-log/conflict-log.service';
import { IConflictLogEntry, ConflictLogStatus } from '../../../shared/interfaces/conflict-log/conflict-log.interfaces';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../shared/enums/page-routes';
import { IHeaderAnimeImage } from '../../../shared/interfaces/header/header';

@Component({
  selector: 'app-conflict-log',
  templateUrl: './conflict-log.page.html',
  styleUrls: ['./conflict-log.page.scss'],
  standalone: false,
})
export class ConflictLogPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  conflictLogs: IConflictLogEntry[] = [];
  isLoading: boolean = true;
  animeImage!: IHeaderAnimeImage;

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
  protected readonly ConflictLogStatus = ConflictLogStatus;

  constructor(
    private conflictLogService: ConflictLogService,
    private router: Router,
    private translate: TranslateService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.setupHeaderAnimation();
    this.loadConflictLogs();
  }

  /**
   * Setup header animation
   */
  private setupHeaderAnimation() {
    this.animeImage = {
      imageUrl: '/assets/images/rank/ranking.png',
      name: this.translate.instant('TITLE.conflict_log'),
      width: '120px',
      height: '120px',
      position: {
        position: 'absolute',
        right: '0'
      }
    };
  }

  /**
   * Load conflict logs
   */
  private async loadConflictLogs() {
    this.isLoading = true;

    try {
      this.conflictLogService.getConflictLogs().subscribe(logs => {
        this.conflictLogs = logs;
        this.isLoading = false;
      });
    } catch (error) {
      console.error('Error loading conflict logs:', error);
      this.isLoading = false;
      this.showErrorToast();
    }
  }

  /**
   * Handle refresh event
   * @param event Refresh event
   */
  async handleRefresh(event: RefresherCustomEvent) {
    await this.loadConflictLogs();
    event.target.complete();
  }

  /**
   * Navigate to conflict log detail
   * @param logId Conflict log ID
   */
  navigateToDetail(logId: number) {
    this.router.navigate([`/${PageRoutes.CONFLICT_LOG}/${logId}`]);
  }

  /**
   * Navigate to new conflict log form
   */
  navigateToNewLog() {
    this.router.navigate([`/${PageRoutes.CONFLICT_LOG}/new`]);
  }

  /**
   * Get status color based on status
   * @param status Conflict log status
   * @returns Color class
   */
  getStatusColor(status: ConflictLogStatus): string {
    switch (status) {
      case ConflictLogStatus.NEW:
        return 'text-blue-500';
      case ConflictLogStatus.IN_PROGRESS:
        return 'text-yellow-500';
      case ConflictLogStatus.RESOLVED:
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  }

  /**
   * Get status icon based on status
   * @param status Conflict log status
   * @returns Icon name
   */
  getStatusIcon(status: ConflictLogStatus): string {
    switch (status) {
      case ConflictLogStatus.NEW:
        return 'ellipse';
      case ConflictLogStatus.IN_PROGRESS:
        return 'time';
      case ConflictLogStatus.RESOLVED:
        return 'checkmark-circle';
      default:
        return 'help-circle';
    }
  }

  /**
   * Format date for display
   * @param date Date to format
   * @returns Formatted date string
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  /**
   * Show error toast
   */
  private async showErrorToast() {
    const toast = await this.toastController.create({
      message: this.translate.instant(TranslateKeys.ERROR_SERVER),
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }
}
