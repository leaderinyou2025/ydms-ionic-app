import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IRankItem } from "../../../shared/interfaces/rank/rank.interfaces";
import { IAchievementCategory } from "../../../shared/interfaces/rank/achievement.interfaces";
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { OdooService, SearchDomain } from '../../../services/odoo/odoo.service';
import { ModelName } from '../../../shared/enums/model-name';
import { OrderBy } from '../../../shared/enums/order-by';
import { ForceTestData } from '../../../shared/classes/force-test-data';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.page.html',
  styleUrls: ['./rank.page.scss'],
  standalone: false,
})
export class RankPage implements OnInit, AfterViewInit {
  activeTab: 'rank' | 'achievements' = 'rank';
  isLoading: boolean = false;
  rankList: IRankItem[] = [];
  userRank: IRankItem | undefined;
  achievements: IAchievementCategory[] = [];

  @ViewChild('rankTableBody') rankTableBody!: ElementRef;
  isCurrentUserVisible: boolean = false;

  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private odooService: OdooService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadRankData();
    this.loadAchievements();
  }

  async loadRankData() {
    this.isLoading = true;
    try {
      // Get rank list from API
      const rankList = await this.fetchRankList();

      // Get current user rank
      const currentUserRank = await this.fetchCurrentUserRank();

      // Process data
      this.rankList = rankList.map((item, index) => ({
        ...item,
        position: index + 1,
        isCurrentUser: item.userId === currentUserRank?.userId
      }));

      this.userRank = currentUserRank;
    } catch (error) {
      console.error('Error loading rank data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load user achievements from server
   */
  async loadAchievements() {
    try {
      this.achievements = await this.fetchAchievements();
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  }

  /**
   * Fetch achievements from server
   * @returns Promise<IAchievementCategory[]>
   */
  private async fetchAchievements(): Promise<IAchievementCategory[]> {
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

  /**
   * Fetch rank list from server
   * @returns Promise<IRankItem[]>
   */
  private async fetchRankList(): Promise<IRankItem[]> {
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
  private async fetchCurrentUserRank(): Promise<IRankItem | undefined> {
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

  switchTab(tab: 'rank' | 'achievements') {
    this.activeTab = tab;
  }

  ngAfterViewInit() {
    // Check if current user is visible after view is initialized
    setTimeout(() => {
      this.checkCurrentUserVisibility();
    }, 500);
  }

  /**
   * Check if current user is visible in the rank list
   */
  checkCurrentUserVisibility() {
    if (!this.rankTableBody || !this.rankTableBody.nativeElement) {
      this.isCurrentUserVisible = false;
      return;
    }

    const rankBodyEl = this.rankTableBody.nativeElement;
    const currentUserEl: HTMLElement | null = rankBodyEl.querySelector('.rank-table-row.current-user');

    if (!currentUserEl) {
      this.isCurrentUserVisible = false;
      return;
    }

    const bodyRect = rankBodyEl.getBoundingClientRect();
    const userRect = currentUserEl.getBoundingClientRect();

    // If user is in the viewport scroll, hide the fixed version
    this.isCurrentUserVisible =
      userRect.bottom > bodyRect.top && userRect.top < bodyRect.bottom;
  }

  /**
   * Check if fixed user rank should be displayed at the bottom
   */
  shouldShowFixedUserRank(): boolean {
    const currentUser = this.getCurrentUserRank();
    if (!currentUser) return false;

    // If user is already visible in the list, hide fixed current user
    if (this.isCurrentUserVisible) {
      return false;
    }

    // Show if position >= 10 and not scrolled to row 10
    return currentUser.position >= 10;
  }

  /**
   * Get current user rank information
   */
  getCurrentUserRank(): IRankItem | undefined {
    // Find current user in the list
    const currentUser = this.rankList.find(item => item.isCurrentUser);

    // If not found, return userRank (if available)
    if (!currentUser && this.userRank) {
      return this.userRank;
    }

    return currentUser;
  }
}
