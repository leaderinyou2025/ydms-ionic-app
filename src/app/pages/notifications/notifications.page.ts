import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { PageRoutes } from '../../shared/enums/page-routes';
import { INotification, NotificationType } from '../../shared/interfaces/notification/notification.interface';
import { NotificationService } from '../../services/notification/notification.service';
import { IHeaderSearchbar, IHeaderSegment } from '../../shared/interfaces/header/header';
import { InputTypes } from '../../shared/enums/input-types';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false,
})
export class NotificationsPage implements OnInit {
  // Current selected tab
  currentTab: 'unread' | 'read' = 'unread';

  // Notifications data
  notifications: INotification[] = [];
  readNotifications: INotification[] = [];
  filteredNotifications: INotification[] = [];

  // Search form state
  isSearchVisible = false;
  searchTitle = '';
  searchType: NotificationType | 'all' = 'all';
  fromDate?: string;
  toDate?: string;

  // Infinite scroll state
  isLoading = false;
  hasMoreData = true;

  // Header configuration
  segment: IHeaderSegment = {
    value: 'unread',
    buttons: [
      { value: 'unread', label: TranslateKeys.NOTIFICATIONS_UNREAD },
      { value: 'read', label: TranslateKeys.NOTIFICATIONS_READ }
    ]
  };

  searchbar: IHeaderSearchbar = {
    placeholder: this.translate.instant(TranslateKeys.NOTIFICATIONS_SEARCH),
    type: InputTypes.TEXT,
    inputmode: InputTypes.TEXT,
    debounce: 500,
    showClearButton: true
  };

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
  protected readonly NotificationType = NotificationType;

  // Notification types for dropdown
  get notificationTypes() {
    return [
      { value: 'all', label: this.translate.instant(TranslateKeys.NOTIFICATIONS_SEARCH_TYPE) },
      { value: NotificationType.EMOTION_SHARED, label: this.translate.instant(TranslateKeys.NOTIFICATIONS_TYPE_EMOTION) },
      { value: NotificationType.PERSONAL_TASK, label: this.translate.instant(TranslateKeys.NOTIFICATIONS_TYPE_TASK) },
      { value: NotificationType.OTHER, label: this.translate.instant(TranslateKeys.NOTIFICATIONS_TYPE_OTHER) }
    ];
  }

  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // Subscribe to unread notifications
    this.notificationService.getUnreadNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });

    // Subscribe to read notifications
    this.notificationService.getReadNotifications().subscribe(notifications => {
      this.readNotifications = notifications;
    });
  }

  /**
   * Handle segment change from header component
   * @param value The selected segment value
   */
  onSegmentChange(value: string | number): void {
    if (typeof value === 'string' && (value === 'unread' || value === 'read')) {
      this.currentTab = value;
    }
  }

  /**
   * Handle search input from header component
   * @param searchText The search text
   */
  onSearchInput(searchText: string): void {
    this.searchTitle = searchText;

    // Apply search after a short delay (debounce)
    setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  /**
   * Handle filter changes with debounce
   */
  onFilterChange(): void {
    // Apply filters after a short delay (debounce)
    setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  /**
   * Format timestamp to display as HH:mm dd/MM/yyyy
   * @param timestamp ISO timestamp string
   * @returns Formatted time string
   */
  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);

    // Format as HH:mm dd/MM/yyyy
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }

  /**
   * Apply search filters
   */
  applyFilters(): void {
    // This will be handled by the backend in a real implementation
    // For now, just simulate filtering

    // Check if we have any search or filter criteria
    const hasSearchTerm = !!this.searchTitle.trim();
    const hasTypeFilter = this.searchType !== 'all';
    const hasDateFilter = !!this.fromDate || !!this.toDate;

    // Set search visible if any filter is applied
    this.isSearchVisible = hasSearchTerm || hasTypeFilter || hasDateFilter;

    if (this.isSearchVisible) {
      // Combine both read and unread notifications for search
      let allNotifications = [...this.notifications, ...this.readNotifications];

      // Apply filters one by one
      if (hasSearchTerm) {
        allNotifications = allNotifications.filter(notification =>
          (notification.title && notification.title.toLowerCase().includes(this.searchTitle.toLowerCase())) ||
          notification.message.toLowerCase().includes(this.searchTitle.toLowerCase())
        );
      }

      if (hasTypeFilter) {
        allNotifications = allNotifications.filter(notification =>
          notification.type === this.searchType
        );
      }

      if (hasDateFilter) {
        const fromTimestamp = this.fromDate ? new Date(this.fromDate).getTime() : 0;
        const toTimestamp = this.toDate ? new Date(this.toDate).getTime() + 86400000 : Date.now(); // Add one day to include the end date

        allNotifications = allNotifications.filter(notification => {
          const notificationTimestamp = new Date(notification.timestamp).getTime();
          return notificationTimestamp >= fromTimestamp && notificationTimestamp <= toTimestamp;
        });
      }

      this.filteredNotifications = allNotifications;
    }
  }

  /**
   * Load more notifications when scrolling
   * @param event The infinite scroll event
   */
  loadMoreNotifications(event: any): void {
    // This would be handled by the backend in a real implementation
    // For now, just complete the event
    setTimeout(() => {
      event.target.complete();
      // In a real implementation, we would check if there are more items to load
      // this.hasMoreData = (more items available);
    }, 500);
  }

  /**
   * Handle pull-to-refresh event
   * @param event The refresh event
   */
  doRefresh(event: any): void {
    // Reset pagination
    this.hasMoreData = true;

    // Reload notifications
    this.notificationService.getUnreadNotifications().subscribe(notifications => {
      this.notifications = notifications;
      event.target.complete();
    });

    this.notificationService.getReadNotifications().subscribe(notifications => {
      this.readNotifications = notifications;
    });

    // If search is active, reapply filters
    if (this.isSearchVisible) {
      this.applyFilters();
    }
  }
}
