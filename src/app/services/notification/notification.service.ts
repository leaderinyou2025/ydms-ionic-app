import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { INotification, NotificationType } from '../../shared/interfaces/notification/notification.interface';
import { ForceTestData } from '../../shared/classes/force-test-data';
import { TranslateKeys } from '../../shared/enums/translate-keys';

export interface NotificationSearchFilters {
  title?: string;
  status?: 'read' | 'unread' | 'all';
  type?: NotificationType | 'all';
  timeRange?: 'today' | 'this_week' | 'this_month' | 'custom';
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  pageSize?: number;
}

export interface NotificationResponse {
  items: INotification[];
  totalCount: number;
  hasMore: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private unreadNotifications: BehaviorSubject<INotification[]> = new BehaviorSubject<INotification[]>(
    ForceTestData.unreadNotifications
  );

  private readNotifications: BehaviorSubject<INotification[]> = new BehaviorSubject<INotification[]>(
    ForceTestData.readNotifications
  );

  // Search filters
  private searchFilters: BehaviorSubject<NotificationSearchFilters> = new BehaviorSubject<NotificationSearchFilters>({
    status: 'all',
    type: 'all',
    timeRange: 'this_month',
    page: 0,
    pageSize: 10
  });

  // Search results will be handled by backend

  constructor(private translate: TranslateService) { }

  getUnreadNotifications(): Observable<INotification[]> {
    return this.unreadNotifications.asObservable();
  }

  getReadNotifications(): Observable<INotification[]> {
    return this.readNotifications.asObservable();
  }

  /**
   * Mark a notification as read
   * @param notificationId ID of the notification to mark as read
   */
  markAsRead(_notificationId: number): void {
    // Empty function shell - will be handled by backend
  }


  getUnreadCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.unreadNotifications.subscribe(notifications => {
        observer.next(notifications.length);
      });
    });
  }

  /**
   * Set search filters
   * @param filters Search filters to apply
   */
  setSearchFilters(_filters: NotificationSearchFilters): void {
    // Empty function shell - will be handled by backend
  }

  /**
   * Get current search filters
   * @returns Current search filters
   */
  getSearchFilters(): Observable<NotificationSearchFilters> {
    // Empty function shell - will be handled by backend
    return this.searchFilters.asObservable();
  }

  /**
   * Search notifications with current filters
   * @param loadMore Whether to load more notifications (for pagination)
   * @returns Filtered notifications for the current page
   */
  searchNotifications(_loadMore: boolean = false): Observable<INotification[]> {
    // Empty function shell - will be handled by backend
    return of([]);
  }

  /**
   * Check if there are more notifications to load
   * @returns True if there are more notifications to load
   */
  hasMoreNotifications(): boolean {
    // Empty function shell - will be handled by backend
    return false;
  }

  /**
   * Format timestamp to display relative time
   * @param timestamp ISO timestamp string
   * @returns Formatted relative time string
   */
  formatTimestamp(timestamp: string): string {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffMins = Math.floor(diffMs / 60000);
  
    if (diffMins < 60) {
      return `${diffMins} ${this.translate.instant(TranslateKeys.NOTIFICATIONS_TIME_MINUTES_AGO)}`;
    }
  
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} ${this.translate.instant(TranslateKeys.NOTIFICATIONS_TIME_HOURS_AGO)}`;
    }
  
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ${this.translate.instant(TranslateKeys.NOTIFICATIONS_TIME_DAYS_AGO)}`;
  }
  
}
