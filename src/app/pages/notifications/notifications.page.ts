import { Component, OnInit } from '@angular/core';
import { RefresherCustomEvent, SelectCustomEvent } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { NotificationService } from '../../services/notification/notification.service';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { PageRoutes } from '../../shared/enums/page-routes';
import { ILiyYdmsNotification } from '../../shared/interfaces/models/liy.ydms.notification';
import { NotificationTypes } from '../../shared/enums/notification-type';
import { IHeaderSearchbar, IHeaderSegment } from '../../shared/interfaces/header/header';
import { InputTypes } from '../../shared/enums/input-types';
import { CommonConstants } from '../../shared/classes/common-constants';
import { DateFormat } from '../../shared/enums/date-format';
import { SearchNotificationParams } from '../../shared/interfaces/notification/notification.interface';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false,
})
export class NotificationsPage implements OnInit {

  // Search form states
  searchForm!: SearchNotificationParams;
  paged!: number;
  limit: number = 20;
  notifications: ILiyYdmsNotification[] = [];

  // Infinite scroll state
  isLoading!: boolean | undefined;
  isLoadMore!: boolean | undefined;
  isRefresh!: boolean | undefined;

  // Header configuration
  segment: IHeaderSegment = {
    value: 'unread',
    buttons: [
      {value: 'unread', label: TranslateKeys.NOTIFICATIONS_UNREAD},
      {value: 'read', label: TranslateKeys.NOTIFICATIONS_READ}
    ]
  };
  searchbar: IHeaderSearchbar = {
    placeholder: this.translate.instant(TranslateKeys.NOTIFICATIONS_SEARCH),
    type: InputTypes.SEARCH,
    inputmode: InputTypes.SEARCH,
    debounce: 500,
    showClearButton: true
  };

  // Notification types for dropdown
  notificationTypes = [
    {value: NotificationTypes.EMOTION_SHARED, label: this.translate.instant(TranslateKeys.NOTIFICATIONS_TYPE_EMOTION)},
    {value: NotificationTypes.PERSONAL_TASK, label: this.translate.instant(TranslateKeys.NOTIFICATIONS_TYPE_TASK)},
    {value: NotificationTypes.OTHER, label: this.translate.instant(TranslateKeys.NOTIFICATIONS_TYPE_OTHER)}
  ]

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
  protected readonly NotificationTypes = NotificationTypes;

  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
  }

  async ngOnInit() {
    this.initParams();
    await this.loadNotifications();
  }

  /**
   * On change filter
   * @param event
   */
  public async onFilterChange(event: SelectCustomEvent): Promise<void> {
    this.searchForm.type = event.detail.value;
    await this.loadNotifications();
  }

  /**
   * Handle segment change from header component
   * @param value The selected segment value
   */
  public async onSegmentChange(value: string | number): Promise<void> {
    if (typeof value !== 'string' || !this.searchForm) return;
    this.searchForm.state = value === 'unread' ? false : (value === 'read' ? true : undefined);
    await this.loadNotifications();
  }

  /**
   * Handle search input from header component
   * @param searchText The search text
   */
  public async onSearchInput(searchText: string): Promise<void> {
    if (!this.searchForm) return;
    this.searchForm.name = searchText;
    await this.loadNotifications();
  }

  /**
   * Load more notifications when scrolling
   * @param event The infinite scroll event
   */
  public async loadMoreNotifications(event: any): Promise<void> {
    if (this.isLoadMore) return event.target.complete();

    const hasMore = this.notifications?.length === ((this.paged - 1) * this.limit);
    if (!hasMore) return event.target.complete();

    this.isLoadMore = true;
    this.paged += 1;
    this.loadNotifications().finally(() => {
      this.isLoadMore = false;
      event.target.complete();
    });
  }

  /**
   * On selected start date
   * @param value
   */
  public async onSelectStartDate(value?: string | Array<string> | null): Promise<void> {
    if (!this.searchForm) return;
    if (!value || typeof (value) === 'string') this.searchForm.start_date = value || undefined;
    return this.loadNotifications();
  }

  /**
   * On selected end date
   * @param value
   */
  public async onSelectEndDate(value?: string | Array<string> | null): Promise<void> {
    if (!this.searchForm) return;
    if (!value || typeof (value) === 'string') this.searchForm.end_date = value || undefined;
    return this.loadNotifications();
  }

  /**
   * Handle pull-to-refresh event
   * @param event The refresh event
   */
  public doRefresh(event: RefresherCustomEvent): void {
    if (this.isRefresh) return;
    this.isRefresh = true;
    this.resetSearch();
    this.loadNotifications().finally(() => {
      this.isRefresh = false;
      event.detail.complete();
    });
  }

  /**
   * Load notifications
   * @private
   */
  private async loadNotifications(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;

    const offset = ((this.paged - 1) * this.limit) || 0;
    const results: ILiyYdmsNotification[] = await this.notificationService.getNotificationList(this.searchForm, offset, this.limit);
    this.notifications = CommonConstants.mergeArrayObjectById(this.notifications, results) || [];
    this.isLoading = false;
  }

  /**
   * Init all params
   * @private
   */
  private initParams() {
    this.searchForm = {
      name: '',
      state: undefined,
      type: undefined,
      start_date: undefined,
      end_date: undefined,
    }
    this.resetSearch();
  }

  /**
   * Reset pages and notification list
   * @private
   */
  private resetSearch(): void {
    this.paged = 1;
    this.notifications = new Array<ILiyYdmsNotification>();
  }

  protected readonly DateFormat = DateFormat;
}
