import { Injectable } from '@angular/core';

import { ILiyYdmsNotification } from '../../shared/interfaces/models/liy.ydms.notification';
import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { SearchNotificationParams } from '../../shared/interfaces/notification/notification.interface';
import { OrderBy } from '../../shared/enums/order-by';
import { OdooDomainOperator } from '../../shared/enums/odoo-domain-operator';
import { ModelName } from '../../shared/enums/model-name';
import { ForceTestData } from '../../shared/classes/force-test-data';
import { CommonConstants } from '../../shared/classes/common-constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // Notification fields
  public notificationFields = [
    'name', 'description', 'body',
    'sender_id', 'recipient_ids',
    'state', 'create_date',
    'attachment_id', 'attachment_name',
  ];

  constructor(
    private odooService: OdooService
  ) {
  }

  /**
   * Get search notifications
   * @param searchParams
   * @param offset
   * @param limit
   * @param order
   */
  public async getNotificationList(
    searchParams: SearchNotificationParams,
    offset: number = 0,
    limit: number = 20,
    order: OrderBy = OrderBy.CREATE_AT_DESC
  ): Promise<ILiyYdmsNotification[]> {

    // Search domain
    const query: SearchDomain = [];
    if (searchParams.name) query.push(['name', OdooDomainOperator.ILIKE, searchParams.name]);
    if (searchParams.state != undefined) query.push(['state', OdooDomainOperator.EQUAL, searchParams.state]);
    if (searchParams.start_date != undefined) query.push(['create_date', OdooDomainOperator.GREATER_EQUAL, searchParams.start_date]);
    if (searchParams.end_date != undefined) query.push(['create_date', OdooDomainOperator.LESS_EQUAL, searchParams.end_date]);
    if (searchParams.type != undefined) query.push(['type', OdooDomainOperator.LESS_EQUAL, searchParams.type]);

    // Fields
    let fields = [...this.notificationFields];
    fields.splice(this.notificationFields.indexOf('attachment_id'), 1);

    // Test data
    const results = await this.odooService.searchRead<ILiyYdmsNotification>(ModelName.NOTIFICATION, query, fields, offset, limit, order);
    return results?.length ? CommonConstants.convertArr2ListItem(results) : ForceTestData.notifications;
  }

  /**
   * Get notification detail by id
   * @param id
   */
  public async getNotificationDetail(id: number): Promise<ILiyYdmsNotification | undefined> {
    if (!id) return undefined;

    // Test data
    return ForceTestData.notifications.find(u => u.id === id);

    let results = await this.odooService.read<ILiyYdmsNotification>(ModelName.NOTIFICATION, [id], this.notificationFields);
    if (!results || !results?.length) return undefined;
    results = CommonConstants.convertArr2ListItem(results);
    return results[0];
  }

  /**
   * Mark a notification as read
   * @param notificationIds
   */
  public async markAsRead(notificationIds: Array<number>): Promise<number | boolean> {
    if (!notificationIds) return true;
    return this.odooService.write<ILiyYdmsNotification>(ModelName.NOTIFICATION, notificationIds, {state: true});
  }

}
