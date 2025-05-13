import { Injectable } from '@angular/core';
import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { AuthService } from '../auth/auth.service';
import { ModelName } from '../../shared/enums/model-name';
import { OrderBy } from '../../shared/enums/order-by';
import { IRankItem } from '../../shared/interfaces/rank/rank.interfaces';
import { IAchievementCategory } from '../../shared/interfaces/rank/achievement.interfaces';
import { ForceTestData } from '../../shared/classes/force-test-data';

@Injectable({
  providedIn: 'root'
})
export class RankService {

  constructor(
    private odooService: OdooService,
    private authService: AuthService
  ) { }

  /**
   * Fetch rank list from server
   * @returns Promise<IRankItem[]>
   */
  public async fetchRankList(): Promise<IRankItem[]> {
    try {
      // Call API to get rank list
      // const args: SearchDomain = [];
      // const fields = ['userId', 'nickname', 'points', 'avatar'];
      // const rankData = await this.odooService.searchRead<IRankItem>(
      //   ModelName.RANK, args, fields, 0, 10, OrderBy.POINTS_DESC
      // );

      // Force rank data
      return ForceTestData.rankData;
    } catch (error) {
      console.error('Error fetching rank list:', error);
      return [];
    }
  }

  /**
   * Fetch current user rank from server
   * @returns Promise<IRankItem | undefined>
   */
  public async fetchCurrentUserRank(): Promise<IRankItem | undefined> {
    try {
      // Call API to get current user rank
      // const authData = await this.authService.getAuthData();
      // if (!authData) return undefined;

      // const args: SearchDomain = [['userId', '=', authData.id]];
      // const fields = ['userId', 'nickname', 'points', 'position', 'avatar'];
      // const userRankData = await this.odooService.searchRead<IRankItem>(
      //   ModelName.RANK, args, fields
      // );

      // return userRankData[0];

      // Force user rank
      return ForceTestData.currentUserRank;
    } catch (error) {
      console.error('Error fetching user rank:', error);
      return undefined;
    }
  }

  /**
   * Fetch achievements from server
   * @returns Promise<IAchievementCategory[]>
   */
  public async fetchAchievements(): Promise<IAchievementCategory[]> {
    try {
      // Call API to get achievements
      // const authData = await this.authService.getAuthData();
      // if (!authData) return [];

      // const args: SearchDomain = [['user_id', '=', authData.id]];
      // const fields = ['id', 'title', 'badges'];
      // const achievementData = await this.odooService.searchRead<IAchievementCategory>(
      //   ModelName.ACHIEVEMENT_CATEGORY, args, fields
      // );

      // For badges, we would need to fetch them separately or use a related field
      // const badgeIds = achievementData.flatMap(category => category.badges || []);
      // if (badgeIds.length) {
      //   const badgeArgs: SearchDomain = [['id', 'in', badgeIds]];
      //   const badgeFields = ['id', 'name', 'desc', 'unlocked', 'is_new', 'image'];
      //   const badgesData = await this.odooService.searchRead(
      //     ModelName.ACHIEVEMENT_BADGE, badgeArgs, badgeFields
      //   );
      //
      //   // Map badges to their categories
      //   // Implementation depends on how the relation is structured in Odoo
      // }

      // Force achievement data
      return ForceTestData.achievementCategories;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  }
}