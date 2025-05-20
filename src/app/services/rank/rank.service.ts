import {Injectable} from '@angular/core';
import {OdooService, SearchDomain} from '../odoo/odoo.service';
import {AuthService} from '../auth/auth.service';
import {ModelName} from '../../shared/enums/model-name';
import {CommonConstants} from "../../shared/classes/common-constants";
import {AreaOfExpertise} from "../../shared/enums/area-of-expertise";
import {leadershipFields} from "../../shared/fields/rank/leadership-fields";
import {badgeCategoryFields} from "../../shared/fields/rank/badge-category-fields";
import {achievementFields} from "../../shared/fields/rank/achievement-fields";
import {IAchievement, IBadge, ILeadership} from "../../shared/interfaces/rank/rank.interfaces";
import {areaOfExpertiesData} from "../../shared/data/area-of-experties.data";

@Injectable({
  providedIn: 'root'
})
export class RankService {

  constructor(
    private odooService: OdooService,
    private authService: AuthService
  ) {
  }

  /**
   * Get avatar URL for a user
   * @param userId User ID to get avatar for
   * @returns URL to the user's avatar or default avatar
   */
  private getAvatarUrl(userId?: number): string {
    if (!userId) return 'https://ionicframework.com/docs/img/demos/avatar.svg';

    // In a real implementation, you would fetch the avatar from a service or API
    // For now, return a default avatar
    return 'https://ionicframework.com/docs/img/demos/avatar.svg';
  }

  /**
   * Fetch rank list from server with pagination and filtering
   * @param areaOfExpertise Optional filter by area of expertise
   * @param offset Number of records to skip (for pagination)
   * @param limit Maximum number of records to return
   * @returns Promise<ILeadership[]>
   */
  public async fetchRankList(
    areaOfExpertise?: AreaOfExpertise,
    offset: number = 0,
    limit: number = 10
  ): Promise<ILeadership[]> {
    try {
      // Call API to get rank list
      const args: SearchDomain = [];

      // Add filter by area of expertise if provided
      if (areaOfExpertise) {
        args.push(['area_of_expertise', '=', areaOfExpertise]);
      }

      const authData = await this.authService.getAuthData();
      if (!authData) return [];

      let rankData = await this.odooService.searchRead<ILeadership>(
        ModelName.RANK, args, leadershipFields, offset, limit
      );
      rankData = CommonConstants.convertArr2ListItem(rankData);

      // Add client-side properties for UI compatibility
      return rankData.map(item => ({
        ...item,
        avatar: this.getAvatarUrl(item.teenager_id?.id),
        isCurrentUser: item.teenager_id?.id === authData?.id
      }));
    } catch (error) {
      console.error('Error fetching rank list:', error);
      return [];
    }
  }

  /**
   * Fetch current user's rank
   * @returns Promise<ILeadership | undefined>
   */
  public async fetchCurrentUserRank(): Promise<ILeadership | undefined> {
    try {
      const authData = await this.authService.getAuthData();
      if (!authData) return undefined;

      const args: SearchDomain = [['teenager_id', '=', authData.id]];

      let rankData = await this.odooService.searchRead<ILeadership>(
        ModelName.RANK, args, leadershipFields, 0, 1
      );
      rankData = CommonConstants.convertArr2ListItem(rankData);

      if (rankData.length === 0) return undefined;

      // Add client-side properties for UI compatibility
      return {
        ...rankData[0],
        avatar: this.getAvatarUrl(rankData[0].teenager_id?.id),
        isCurrentUser: true
      };
    } catch (error) {
      console.error('Error fetching current user rank:', error);
      return undefined;
    }
  }


  /**
   * Fetch badge categories (achievement categories)
   * @param areaOfExpertise Optional filter by area of expertise
   * @param offset Number of records to skip (for pagination)
   * @param limit Maximum number of records to return
   * @returns Promise<IBadge[]>
   */
  public async fetchBadgeCategories(
    areaOfExpertise?: AreaOfExpertise,
    offset: number = 0,
    limit: number = 10
  ): Promise<IBadge[]> {
    try {
      const args: SearchDomain = [];

      // Add filter by area of expertise if provided
      if (areaOfExpertise) {
        args.push(['area_of_expertise', '=', areaOfExpertise]);
      }

      let categories = await this.odooService.searchRead<IBadge>(
        ModelName.ACHIEVEMENT_CATEGORY, args, badgeCategoryFields, offset, limit
      );
      return CommonConstants.convertArr2ListItem(categories);
    } catch (error) {
      console.error('Error fetching badge categories:', error);
      return [];
    }
  }

  /**
   * Fetch achievements (earned badges)
   * @param areaOfExpertise Optional filter by area of expertise
   * @param offset Number of records to skip (for pagination)
   * @param limit Maximum number of records to return
   * @returns Promise<IAchievement[]>
   */
  public async fetchUserAchievements(
    areaOfExpertise?: AreaOfExpertise,
    offset: number = 0,
    limit: number = 10
  ): Promise<IAchievement[]> {
    try {
      const authData = await this.authService.getAuthData();
      if (!authData) return [];

      const args: SearchDomain = [['teenager_id', '=', authData.id]];

      // Add filter by area of expertise if provided
      if (areaOfExpertise) {
        args.push(['area_of_expertise', '=', areaOfExpertise]);
      }

      let achievements = await this.odooService.searchRead<IAchievement>(
        ModelName.ACHIEVEMENT, args, achievementFields, offset, limit
      );
      return CommonConstants.convertArr2ListItem(achievements);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
  }

  /**
   * Process achievement data into badge format
   * @param achievement Achievement data
   * @param authData Auth data for checking if badge belongs to current user
   * @param matchedCategory Matched badge category
   * @returns Processed badge object
   * @private
   */
  private processAchievementToBadge(achievement: IAchievement, authData: any, matchedCategory?: IBadge) {
    return {
      id: achievement.badge_id?.id,
      name: achievement.badge_id?.name ?? '',
      unlocked: achievement.teenager_id?.id === authData.id,
      isNew: false,
      image: achievement.badge_image ? `data:image/png;base64,${achievement.badge_image}` : '',
      order_weight: matchedCategory?.order_weight ?? 0
    };
  }

  /**
   * Process badge category into badge format
   * @param category Badge category
   * @returns Processed badge object
   * @private
   */
  private processBadgeCategory(category: IBadge) {
    return {
      id: category.id,
      name: category.name ?? '',
      unlocked: false,
      isNew: false,
      image: category.review_image ? `data:image/png;base64,${category.review_image}` : '',
      order_weight: category.order_weight ?? 99
    };
  }

  /**
   * Create a badge category result object
   * @param category Category data
   * @param badges Array of badges
   * @returns IBadge object
   * @private
   */
  private createBadgeCategoryResult(category: any, badges: any[]): IBadge {
    return {
      id: category.id,
      title: category.title,
      badges: badges || []
    } as IBadge; // Cast to IBadge to satisfy TypeScript
  }

  /**
   * Process achievements and badges for a specific category
   * @param category Category to process
   * @param achievementCategories All achievement categories
   * @param badgesData User achievements data
   * @param authData Auth data
   * @returns Processed category with badges
   * @private
   */
  private processCategoryWithBadges(category: any, achievementCategories: IBadge[], badgesData: IAchievement[], authData: any): IBadge {
    // Get all achievement categories for this area
    const areaCategories = achievementCategories.filter(
      cat => cat.area_of_expertise === category.area
    );

    // Get unlocked badges from badgesData
    const unlockedBadges = badgesData
      .filter(badge => badge.area_of_expertise === category.area)
      .map(badge => {
        const matchedCategory = achievementCategories.find(
          cat => cat.id === badge.badge_id?.id
        );
        return this.processAchievementToBadge(badge, authData, matchedCategory);
      });

    // Create a map of unlocked badge IDs for quick lookup
    const unlockedBadgeIds = new Set(unlockedBadges.map(badge => badge.id));

    // Add locked badges from achievement categories that aren't in badgesData
    const lockedBadges = areaCategories
      .filter(cat => !unlockedBadgeIds.has(cat.id))
      .map(cat => this.processBadgeCategory(cat));

    // Combine unlocked and locked badges
    const allBadges = [...unlockedBadges, ...lockedBadges];

    // Sort badges within category
    allBadges.sort((a, b) => a.order_weight - b.order_weight);

    // Create a proper IBadge object with all required properties
    return this.createBadgeCategoryResult(category, allBadges);
  }

  /**
   * Fetch and organize achievements by categories
   * @param areaOfExpertise Optional filter by area of expertise
   * @returns Promise<IBadge[]> - Badge categories with badges
   */
  public async fetchAchievements(areaOfExpertise?: AreaOfExpertise, offset: number = 0, limit: number = 10): Promise<IBadge[]> {
    try {
      const authData = await this.authService.getAuthData();
      if (!authData) return [];

      // Fetch achievement categories and user achievements in parallel
      const [achievementCategories, badgesData] = await Promise.all([
        this.fetchBadgeCategories(areaOfExpertise, offset, limit),
        this.fetchUserAchievements(areaOfExpertise, offset, limit)
      ]);

      // Filter categories if area of expertise is specified
      const categoriesToProcess = areaOfExpertise
        ? areaOfExpertiesData.filter(cat => cat.area === areaOfExpertise)
        : areaOfExpertiesData;

      // Process each category with its badges
      const result = categoriesToProcess.map(category =>
        this.processCategoryWithBadges(category, achievementCategories, badgesData, authData)
      );

      return result.some(cat => cat['badges'].length > 0) ? result : [];

    } catch (error) {
      console.error('Error organizing achievements:', error);
      return [];
    }
  }
}
