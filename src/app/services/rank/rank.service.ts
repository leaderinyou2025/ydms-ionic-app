import { Injectable } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { LiyYdmsAvatarService } from '../models/liy.ydms.avatar.service';
import { LiyYdmsBadgeService } from '../models/liy.ydms.badge.service';
import { LiyYdmsLeadershipService } from '../models/liy.ydms.leadership.service';
import { LiyYdmsAchievementService } from '../models/liy.ydms.achievement.service';
import { ILeadership } from '../../shared/interfaces/rank/rank.interfaces';
import { SearchDomain } from '../odoo/odoo.service';
import { OdooDomainOperator } from '../../shared/enums/odoo-domain-operator';
import { IAssetsResource } from '../../shared/interfaces/settings/assets-resource';
import { IAuthData } from '../../shared/interfaces/auth/auth-data';

@Injectable({
  providedIn: 'root'
})
export class RankService {

  private cacheAvatarResource: Map<number, IAssetsResource> = new Map<number, IAssetsResource>();

  constructor(
    private authService: AuthService,
    private liyYdmsLeadershipService: LiyYdmsLeadershipService,
    private liyYdmsAchievementService: LiyYdmsAchievementService,
    private liyYdmsAvatarService: LiyYdmsAvatarService,
    private liyYdmsBadgeService: LiyYdmsBadgeService
  ) {
  }

  /**
   * Lấy danh sách xếp hạng trừ tài khoản chính mình
   * @param teenagerId
   * @param offset
   * @param limit
   */
  public async getLeadershipListIgnoreCurrent(
    teenagerId: number,
    offset: number = 0,
    limit: number = 20
  ): Promise<ILeadership[]> {
    const searchDomain: SearchDomain = [['teenager_id', OdooDomainOperator.NOT_EQUAL, teenagerId]];
    return this.liyYdmsLeadershipService.getLeadershipList(searchDomain, offset, limit);
  }

  /**
   * Lấy xếp hạng của tài khoản học sinh
   * @param teenagerId
   */
  public async getLeadershipByTeenagerId(teenagerId: number): Promise<ILeadership | undefined> {
    return this.liyYdmsLeadershipService.getLeadershipByTeenagerId(teenagerId);
  }

  /**
   * Load teenager avatar resource and caching
   * @param teenagerIds
   */
  public async loadTeenagerAvatarResource(teenagerIds: number[]): Promise<IAuthData[]> {
    const teenagerAvatars = await this.authService.getAvatarByTeenagerIds(teenagerIds);
    const avatarIds: number[] = Array.from(new Set(
      teenagerAvatars.flatMap(teenager => {
        const id = teenager?.avatar?.id;
        return id != null && !this.cacheAvatarResource.has(id) ? [id] : [];
      })
    ));

    if (!avatarIds?.length) return teenagerAvatars;

    // Load avatar resource and caching
    const avatarResource = await this.liyYdmsAvatarService.getImageByIds(avatarIds);
    for (const avatar of avatarResource) {
      if (avatar?.id != null && !this.cacheAvatarResource.has(avatar.id))
        this.cacheAvatarResource.set(avatar.id, avatar);
    }

    return teenagerAvatars;
  }

  /**
   * Get avatar resource on cache
   * @param avatarId
   */
  public getAvatarResource(avatarId: number): IAssetsResource| undefined {
    return this.cacheAvatarResource.get(avatarId);
  }

}
