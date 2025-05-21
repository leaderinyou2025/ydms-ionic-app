import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { ConflictLogService } from '../../../../services/conflict-log/conflict-log.service';
import { IConflictLogDetail, ConflictLogStatus } from '../../../../shared/interfaces/conflict-log/conflict-log.interfaces';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../shared/enums/page-routes';
import { IHeaderAnimeImage } from 'src/app/shared/interfaces/header/header';

@Component({
  selector: 'app-conflict-log-detail',
  templateUrl: './conflict-log-detail.component.html',
  styleUrls: ['./conflict-log-detail.component.scss'],
  standalone: false,
})
export class ConflictLogDetailComponent implements OnInit {
  logDetail!: IConflictLogDetail;
  isLoading: boolean = true;
  animeImage!: IHeaderAnimeImage;

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
  protected readonly ConflictLogStatus = ConflictLogStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private conflictLogService: ConflictLogService,
    private translate: TranslateService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadLogDetail();
    this.setupHeaderAnimation();
  }

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
   * Load conflict log detail
   */
  private async loadLogDetail() {
    this.isLoading = true;

    try {
      const logId = Number(this.route.snapshot.paramMap.get('id'));
      if (isNaN(logId)) {
        this.navigateBack();
        return;
      }

      const logDetail = await this.conflictLogService.getConflictLogDetail(logId);
      if (!logDetail) {
        this.showErrorToast(this.translate.instant(TranslateKeys.ERROR_NOT_FOUND));
        this.navigateBack();
        return;
      }

      this.logDetail = logDetail;
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading conflict log detail:', error);
      this.isLoading = false;
      this.showErrorToast(this.translate.instant(TranslateKeys.ERROR_SERVER));
    }
  }

  /**
   * Navigate back to the conflict log list
   */
  navigateBack() {
    this.router.navigate([`/${PageRoutes.CONFLICT_LOG}`]);
  }

  /**
   * Navigate to update progress form
   */
  navigateToUpdateProgress() {
    this.router.navigate([`/${PageRoutes.CONFLICT_LOG}/${this.logDetail.id}/progress`]);
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
   * Get status text based on status
   * @param status Conflict log status
   * @returns Status text
   */
  getStatusText(status: ConflictLogStatus): string {
    switch (status) {
      case ConflictLogStatus.NEW:
        return this.translate.instant('CONFLICT_LOG.status_new');
      case ConflictLogStatus.IN_PROGRESS:
        return this.translate.instant('CONFLICT_LOG.status_in_progress');
      case ConflictLogStatus.RESOLVED:
        return this.translate.instant('CONFLICT_LOG.status_resolved');
      default:
        return this.translate.instant('CONFLICT_LOG.status_unknown');
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
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Show error toast
   * @param message Error message
   */
  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }
}
