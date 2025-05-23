import { Injectable } from '@angular/core';

import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { AreaOfExpertise } from '../../shared/enums/area-of-expertise';
import { OdooDomainOperator } from '../../shared/enums/odoo-domain-operator';
import { ModelName } from '../../shared/enums/model-name';
import { CommonConstants } from '../../shared/classes/common-constants';
import { ILiyYdmsLeadership } from '../../shared/interfaces/models/liy.ydms.leadership';
import { OrderBy } from '../../shared/enums/order-by';

@Injectable({
  providedIn: 'root'
})
export class LiyYdmsLeadershipService {

  public readonly leadershipFields = [
    'teenager_id',
    'name',
    'area_of_expertise',
    'parent_id',
    'rank_month',
    'total_points',
    'ranking',
    'nickname',
  ];

  constructor(
    private odooService: OdooService,
  ) {
  }

  /**
   * getLeadershipList
   * @param searchDomain
   * @param offset
   * @param limit
   * @param order
   */
  public async getLeadershipList(
    searchDomain: SearchDomain = [],
    offset: number = 0,
    limit: number = 20,
    order: OrderBy = OrderBy.RANKING_ASC
  ): Promise<ILiyYdmsLeadership[]> {
    let results = await this.odooService.searchRead<ILiyYdmsLeadership>(
      ModelName.LEADERSHIP, searchDomain, this.leadershipFields, offset, limit, order
    );
    return CommonConstants.convertArr2ListItem(results);
  }

  /**
   * Fetch leadership list by area_of_expertise
   * @param areaOfExpertise
   * @param offset
   * @param limit
   * @param order
   */
  public async getLeadershipListByAreaOfExpertise(
    areaOfExpertise: AreaOfExpertise,
    offset: number = 0,
    limit: number = 20,
    order: OrderBy = OrderBy.RANKING_ASC
  ): Promise<ILiyYdmsLeadership[]> {
    const searchDomain: SearchDomain = [['area_of_expertise', OdooDomainOperator.EQUAL, areaOfExpertise]];
    return this.getLeadershipList(searchDomain, offset, limit, order);
  }

  /**
   * Get leadership by
   * @param teenagerId
   */
  public async getLeadershipByTeenagerId(teenagerId: number): Promise<ILiyYdmsLeadership | undefined> {
    const searchDomain: SearchDomain = [['teenager_id', OdooDomainOperator.EQUAL, teenagerId]];
    let results = await this.getLeadershipList(searchDomain, 0, 1);
    return results?.length ? results[0] : undefined;
  }
}
