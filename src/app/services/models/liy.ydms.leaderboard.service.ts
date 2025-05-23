import { Injectable } from '@angular/core';

import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { AreaOfExpertise } from '../../shared/enums/area-of-expertise';
import { OdooDomainOperator } from '../../shared/enums/odoo-domain-operator';
import { ModelName } from '../../shared/enums/model-name';
import { CommonConstants } from '../../shared/classes/common-constants';
import { ILiyYdmsLeaderboard } from '../../shared/interfaces/models/liy.ydms.leaderboard';
import { OrderBy } from '../../shared/enums/order-by';

@Injectable({
  providedIn: 'root'
})
export class LiyYdmsLeaderboardService {

  public readonly leaderboardFields = [
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
   * getLeaderboardList
   * @param searchDomain
   * @param offset
   * @param limit
   * @param order
   */
  public async getLeaderboardList(
    searchDomain: SearchDomain = [],
    offset: number = 0,
    limit: number = 20,
    order: OrderBy = OrderBy.RANKING_ASC
  ): Promise<ILiyYdmsLeaderboard[]> {
    let results = await this.odooService.searchRead<ILiyYdmsLeaderboard>(
      ModelName.LEADERBOARD, searchDomain, this.leaderboardFields, offset, limit, order
    );
    return CommonConstants.convertArr2ListItem(results);
  }

  /**
   * Fetch leaderboard list by area_of_expertise
   * @param areaOfExpertise
   * @param offset
   * @param limit
   * @param order
   */
  public async getLeaderboardListByAreaOfExpertise(
    areaOfExpertise: AreaOfExpertise,
    offset: number = 0,
    limit: number = 20,
    order: OrderBy = OrderBy.RANKING_ASC
  ): Promise<ILiyYdmsLeaderboard[]> {
    const searchDomain: SearchDomain = [['area_of_expertise', OdooDomainOperator.EQUAL, areaOfExpertise]];
    return this.getLeaderboardList(searchDomain, offset, limit, order);
  }

  /**
   * Get leaderboard by
   * @param teenagerId
   */
  public async getLeaderboardByTeenagerId(teenagerId: number): Promise<ILiyYdmsLeaderboard | undefined> {
    const searchDomain: SearchDomain = [['teenager_id', OdooDomainOperator.EQUAL, teenagerId]];
    let results = await this.getLeaderboardList(searchDomain, 0, 1);
    return results?.length ? results[0] : undefined;
  }
}
