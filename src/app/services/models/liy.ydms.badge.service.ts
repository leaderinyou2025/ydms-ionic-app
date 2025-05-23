import { Injectable } from '@angular/core';

import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { OrderBy } from '../../shared/enums/order-by';
import { ILiyYdmsBadge } from '../../shared/interfaces/models/liy.ydms.badge';
import { ModelName } from '../../shared/enums/model-name';
import { AreaOfExpertise } from '../../shared/enums/area-of-expertise';
import { OdooDomainOperator } from '../../shared/enums/odoo-domain-operator';

@Injectable({
  providedIn: 'root'
})
export class LiyYdmsBadgeService {
  public readonly badgeCategoryFields = [
    'name',
    'active_image',
    'review_image',
    'area_of_expertise',
    'order_weight',
  ];

  constructor(
    private odooService: OdooService
  ) {
  }

  /**
   * getBadgeList
   * @param searchDomain
   * @param offset
   * @param limit
   * @param order
   */
  public async getBadgeList(
    searchDomain: SearchDomain = [],
    offset: number = 0,
    limit: number = 20,
    order: OrderBy = OrderBy.ORDER_WEIGHT_ASC
  ): Promise<ILiyYdmsBadge[]> {
    return this.odooService.searchRead<ILiyYdmsBadge>(
      ModelName.BADGE, searchDomain, this.badgeCategoryFields, offset, limit, order
    );
  }

  /**
   * Lấy danh sách huy hiệu chưa đạt được theo khia cạnh.
   * @param areaOfExpertise
   * @param ignoreBadgeIds
   * @param offset
   * @param limit
   * @param order
   */
  public async getBadgesByExpertiseOfArea(
    areaOfExpertise: AreaOfExpertise,
    ignoreBadgeIds: Array<number> = [],
    offset: number = 0,
    limit: number = 20,
    order: OrderBy = OrderBy.ORDER_WEIGHT_ASC
  ): Promise<ILiyYdmsBadge[]> {
    const searchDomain: SearchDomain = [['area_of_expertise', OdooDomainOperator.EQUAL, areaOfExpertise]];
    if (ignoreBadgeIds.length > 0) searchDomain.push(['id', OdooDomainOperator.NOT_IN, ignoreBadgeIds]);
    return this.getBadgeList(searchDomain, offset, limit, order);
  }
}
