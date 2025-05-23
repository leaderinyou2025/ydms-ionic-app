import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, RefresherCustomEvent, SegmentValue } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { RankService } from '../../../services/rank/rank.service';
import { IHeaderAnimation, IHeaderAnimeImage, IHeaderSegment } from '../../../shared/interfaces/header/header';
import { IAchievement, IBadge, ILeaderboard } from '../../../shared/interfaces/rank/rank.interfaces';
import { IAuthData } from '../../../shared/interfaces/auth/auth-data';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonConstants } from '../../../shared/classes/common-constants';
import { AreaOfExpertise } from '../../../shared/enums/area-of-expertise';
import { IonInfiniteHorizontalDirective } from '../../../core/directive/ion-infinite-horizontal.directive';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.page.html',
  styleUrls: ['./rank.page.scss'],
  standalone: false,
})
export class RankPage implements OnInit, AfterViewInit, OnDestroy {

  activeTab!: 'rank' | 'achievements';
  segment!: IHeaderSegment;
  animeImage!: IHeaderAnimeImage;
  animation!: IHeaderAnimation;

  authData?: IAuthData;
  isLoading: boolean = false;

  // Leaderboard
  leaderboardList!: ILeaderboard[];
  userLeaderboard?: ILeaderboard;

  // Badge
  emotionBadges!: IBadge[];
  conflictBadges!: IBadge[];
  communicationBadges!: IBadge[];
  discoveryBadges!: IBadge[];
  achievements!: IAchievement[]; // Tất cả thành tích đạt được trong tháng (New tag)
  ignoreBadgeIds!: Array<number>;

  @ViewChild('rankTableBody') rankTableBody!: ElementRef;
  isCurrentUserVisible: boolean = false;

  // Pagination
  private leaderboardPaged: number = 1;
  private emotionBadgePaged: number = 1;
  private conflictBadgePaged: number = 1;
  private communicationBadgePaged: number = 1;
  private discoveryBadgePaged: number = 1;
  private readonly limit = 20;
  private isLoadingEmotionBadge!: boolean;
  private isLoadingConflictBadge!: boolean;
  private isLoadingCommunicationBadge!: boolean;
  private isLoadingDiscoveryBadge!: boolean;

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly AreaOfExpertise = AreaOfExpertise;

  constructor(
    private rankService: RankService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.activeTab = params['activeTab'] || 'rank';
      this.initHeader();
    });
    this.authData = await this.authService.getAuthData();
  }

  ionViewWillEnter() {
    if (this.activeTab === 'rank') {
      this.loadRankData();
    } else if (this.activeTab === 'achievements') {
      this.loadBadgeData();
    }
  }

  ngAfterViewInit() {
    // Check if current user is visible after view is initialized
    setTimeout(() => {
      this.checkCurrentUserVisibility();

      // Add scroll event listener to the rank table body
      if (this.rankTableBody && this.rankTableBody.nativeElement) {
        this.rankTableBody.nativeElement.addEventListener('scroll', () => {
          this.checkCurrentUserVisibility();
        });
      }
    }, 500);
  }

  ngOnDestroy() {
    // Remove scroll event listener when component is destroyed
    if (this.rankTableBody && this.rankTableBody.nativeElement) {
      this.rankTableBody.nativeElement.removeEventListener('scroll', () => {
        this.checkCurrentUserVisibility();
      });
    }
  }

  /**
   * Handle refresh
   * @param event
   */
  public handleRefresh(event: RefresherCustomEvent): void {
    if (this.activeTab === 'rank') {
      this.loadRankData(true).finally(() => event.target.complete());
    } else if (this.activeTab === 'achievements') {
      this.loadBadgeData(true).finally(() => event.target.complete());
    }
  }


  /**
   * init header
   * @private
   */
  private initHeader(): void {
    this.segment = {
      value: this.activeTab,
      buttons: [
        {value: 'rank', label: TranslateKeys.TITLE_RANK},
        {value: 'achievements', label: TranslateKeys.TITLE_ACHIEVEMENTS}
      ]
    };
    this.animeImage = {
      name: 'rank',
      imageUrl: '/assets/images/rank/ranking.png',
      width: '130px',
      height: 'auto',
      position: {
        position: 'absolute',
        right: '-20px'
      }
    };
    this.animation = {
      animation: {
        path: '/assets/animations/1747072943679.json',
        loop: true,
        autoplay: true,
      },
      width: '130px',
      height: '130px',
      position: {
        position: 'absolute',
        top: '-30px',
        right: '50px',
      }
    }
  }

  /*------------------------ Leaderboard ---------------------------------*/

  /**
   * Load more data
   * @param event
   */
  public loadMoreLeaderboardData(event: InfiniteScrollCustomEvent): void {
    if (this.isLoading) {
      event.target.complete();
      return;
    }

    // Ngừng load thêm khi đã đến trang cuối cùng
    if (this.leaderboardList?.length < ((this.leaderboardPaged - 1) * this.limit)) {
      event.target.complete();
      return;
    }

    this.leaderboardPaged += 1;
    this.loadLeaderboardList().finally(() => event.target.complete());
  }

  /**
   * Load rank data
   * @param isRefresh
   * @private
   */
  private async loadRankData(isRefresh = false): Promise<void> {
    if (isRefresh) {
      this.leaderboardPaged = 1;
      this.leaderboardList = new Array<ILeaderboard>();
    }
    this.loadCurrentLeaderboard();
    await this.loadLeaderboardList();
  }

  /**
   * Load leaderboard list
   * @private
   */
  private async loadLeaderboardList(): Promise<void> {
    if (this.isLoading || !this.authData) return;
    this.isLoading = true;

    const offset = (this.leaderboardPaged - 1) * this.limit;
    const results = await this.rankService.getLeaderboardListIgnoreCurrent(
      this.authData.id, offset, this.limit
    );

    this.leaderboardList = CommonConstants.mergeArrayObjectById(this.leaderboardList, results) || [];
    this.lazyLoadTeenagerAvatar(results);
    this.activeTab = 'rank';
    this.isLoading = false;
  }

  /**
   * Load current user leaderboard
   * @private
   */
  private loadCurrentLeaderboard(): void {
    if (!this.authData) return;
    this.rankService.getLeaderboardByTeenagerId(this.authData.id)
      .then(leaderboard => {
        this.userLeaderboard = leaderboard;
        if (leaderboard) this.lazyLoadTeenagerAvatar([leaderboard]);
      });
  }

  /**
   * Lazy load teenager avatar image
   * @param leaderboards
   * @private
   */
  private lazyLoadTeenagerAvatar(leaderboards: Array<ILeaderboard>): void {
    if (!leaderboards?.length) return;
    const teenagerIds = leaderboards.map(item => item.teenager_id.id);
    this.rankService.loadTeenagerAvatarResource(teenagerIds).then(teenagerAvatars => {
      for (const teenagerAvatar of teenagerAvatars) {
        const isCurrentUser = teenagerAvatar.id === this.userLeaderboard?.teenager_id.id;
        let existLeaderboardIndex = this.leaderboardList.findIndex(u => u.teenager_id.id === teenagerAvatar.id);

        if (!isCurrentUser && existLeaderboardIndex < 0) continue;

        if (!teenagerAvatar.avatar) {
          (isCurrentUser && this.userLeaderboard) ?
            this.userLeaderboard.avatar = CommonConstants.defaultUserAvatarImage :
            this.leaderboardList[existLeaderboardIndex].avatar = CommonConstants.defaultUserAvatarImage;
          continue;
        }

        const avatar = this.rankService.getAvatarResource(teenagerAvatar.avatar?.id);

        if (isCurrentUser && this.userLeaderboard) {
          this.userLeaderboard.avatar = avatar?.resource_url || CommonConstants.defaultUserAvatarImage;
          continue;
        }

        this.leaderboardList[existLeaderboardIndex].avatar = avatar?.resource_url || CommonConstants.defaultUserAvatarImage;
      }
    });
  }

  /**
   * Switch between rank and achievements tabs
   * @param tab - The tab to switch to
   */
  public switchTab(tab: SegmentValue | undefined): void {
    if ((tab !== 'rank' && tab !== 'achievements') || this.isLoading) return;

    this.activeTab = tab;
    if (this.activeTab === 'rank') {
      this.loadRankData(true);
    } else if (this.activeTab === 'achievements') {
      this.loadBadgeData(true);
    }
  }

  /**
   * Check if current user is visible in the rank list
   */
  public checkCurrentUserVisibility(): void {
    if (!this.rankTableBody || !this.rankTableBody.nativeElement) {
      this.isCurrentUserVisible = false;
      return;
    }

    const rankBodyEl = this.rankTableBody.nativeElement;
    const currentUserEl: HTMLElement | null = rankBodyEl.querySelector('.current-user');

    if (!currentUserEl) {
      this.isCurrentUserVisible = false;
      return;
    }

    const bodyRect = rankBodyEl.getBoundingClientRect();
    const userRect = currentUserEl.getBoundingClientRect();

    // Check if the current user row is fully visible in the viewport
    this.isCurrentUserVisible =
      userRect.top >= bodyRect.top &&
      userRect.bottom <= bodyRect.bottom &&
      userRect.height > 0;
  }

  /**
   * Check if fixed user rank should be displayed at the bottom
   */
  public shouldShowFixedUserLeaderboard(): boolean {
    const currentUser = this.userLeaderboard;
    if (!currentUser) return false;

    // If user is already visible in the list, hide fixed current user
    if (this.isCurrentUserVisible) {
      return false;
    }

    // Show if position is in the list but not currently visible
    return currentUser.ranking >= 4; // Only show for users not in top 3
  }

  /*------------------------------ Badges ---------------------------------*/

  /**
   * Load more badge
   * @param event
   * @param areaOfExpertise
   */
  public loadMoreBadges(
    event: IonInfiniteHorizontalDirective,
    areaOfExpertise: AreaOfExpertise
  ): void {
    if (this.isLoading) return event.complete();

    if (areaOfExpertise === AreaOfExpertise.EMOTION) {
      if (this.isLoadingEmotionBadge ||
        (this.emotionBadges?.length < ((this.emotionBadgePaged - 1) * this.limit))) {
        return event.complete();
      } else {
        this.emotionBadgePaged += 1;
        this.loadEmotionBadge().finally(() => event.complete());
      }
      return;
    }

    if (areaOfExpertise === AreaOfExpertise.CONFLICT) {
      if (this.isLoadingConflictBadge ||
        (this.conflictBadges?.length < ((this.conflictBadgePaged - 1) * this.limit))) {
        return event.complete();
      } else {
        this.conflictBadgePaged += 1;
        this.loadConflictBadge().finally(() => event.complete());
      }
      return;
    }

    if (areaOfExpertise === AreaOfExpertise.COMMUNICATION) {
      if (this.isLoadingCommunicationBadge ||
        (this.communicationBadges?.length < ((this.communicationBadgePaged - 1) * this.limit))) {
        return event.complete();
      } else {
        this.communicationBadgePaged += 1;
        this.loadCommunicationBadge().finally(() => event.complete());
      }
      return;
    }

    if (areaOfExpertise === AreaOfExpertise.DISCOVERY) {
      if (this.isLoadingDiscoveryBadge ||
        (this.discoveryBadges?.length < ((this.discoveryBadgePaged - 1) * this.limit))) {
        return event.complete();
      } else {
        this.discoveryBadgePaged += 1;
        this.loadDiscoveryBadge().finally(() => event.complete());
      }
      return;
    }
  }

  /**
   * loadBadgeData
   * @param isRefresh
   * @private
   */
  private async loadBadgeData(isRefresh: boolean = false): Promise<void> {
    if (isRefresh) {
      this.emotionBadgePaged = 1;
      this.emotionBadges = new Array<IBadge>();
      this.conflictBadgePaged = 1;
      this.conflictBadges = new Array<IBadge>();
      this.communicationBadgePaged = 1;
      this.communicationBadges = new Array<IBadge>();
      this.discoveryBadgePaged = 1;
      this.discoveryBadges = new Array<IBadge>();
    }
    await this.loadUserAchievement();
    await this.loadBadge();
  }

  /**
   * Load user achievement
   * @private
   */
  private async loadUserAchievement(): Promise<void> {
    if (!this.authData) return;
    this.achievements = await this.rankService.getUserAchievementThisMonth(this.authData.id);
    this.ignoreBadgeIds = Array.from(new Set(
      this.achievements.flatMap(achievement => {
        const id = achievement.badge_id?.id;
        return id != null ? [id] : [];
      })
    ));
  }


  /**
   * Load data badge by area of expertise
   * @private
   */
  private async loadBadge(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;
    await Promise.all([
      this.loadEmotionBadge(),
      this.loadConflictBadge(),
      this.loadCommunicationBadge(),
      this.loadDiscoveryBadge()
    ]);
    this.isLoading = false;
  }

  /**
   * loadEmotionBadge
   * @private
   */
  private async loadEmotionBadge(): Promise<void> {
    if (this.isLoadingEmotionBadge) return;
    this.isLoadingEmotionBadge = true;

    const offset = (this.emotionBadgePaged - 1) * this.limit;
    const results = await this.rankService.getBadgeByByAreaOfExpertise(
      AreaOfExpertise.EMOTION, this.ignoreBadgeIds, offset, this.limit
    );

    this.emotionBadges = CommonConstants.mergeArrayObjectById(this.emotionBadges, results) || [];
    this.lazyLoadBadgeUnlocked(results, AreaOfExpertise.EMOTION);
    this.isLoadingEmotionBadge = false;
  }

  /**
   * loadConflictBadge
   * @private
   */
  private async loadConflictBadge(): Promise<void> {
    if (this.isLoadingConflictBadge) return;
    this.isLoadingConflictBadge = true;

    const offset = (this.conflictBadgePaged - 1) * this.limit;
    const results = await this.rankService.getBadgeByByAreaOfExpertise(
      AreaOfExpertise.CONFLICT, this.ignoreBadgeIds, offset, this.limit
    );

    this.conflictBadges = CommonConstants.mergeArrayObjectById(this.conflictBadges, results) || [];
    this.lazyLoadBadgeUnlocked(results, AreaOfExpertise.CONFLICT);
    this.isLoadingConflictBadge = false;
  }

  /**
   * loadCommunicationBadge
   * @private
   */
  private async loadCommunicationBadge(): Promise<void> {
    if (this.isLoadingCommunicationBadge) return;
    this.isLoadingCommunicationBadge = true;

    const offset = (this.communicationBadgePaged - 1) * this.limit;
    const results = await this.rankService.getBadgeByByAreaOfExpertise(
      AreaOfExpertise.COMMUNICATION, this.ignoreBadgeIds, offset, this.limit
    );

    this.communicationBadges = CommonConstants.mergeArrayObjectById(this.communicationBadges, results) || [];
    this.lazyLoadBadgeUnlocked(results, AreaOfExpertise.COMMUNICATION);
    this.isLoadingCommunicationBadge = false;
  }

  /**
   * loadDiscoveryBadge
   * @private
   */
  private async loadDiscoveryBadge(): Promise<void> {
    if (this.isLoadingDiscoveryBadge) return;
    this.isLoadingDiscoveryBadge = true;

    const offset = (this.discoveryBadgePaged - 1) * this.limit;
    const results = await this.rankService.getBadgeByByAreaOfExpertise(
      AreaOfExpertise.DISCOVERY, this.ignoreBadgeIds, offset, this.limit
    );

    this.discoveryBadges = CommonConstants.mergeArrayObjectById(this.discoveryBadges, results) || [];
    this.lazyLoadBadgeUnlocked(results, AreaOfExpertise.DISCOVERY);
    this.isLoadingDiscoveryBadge = false;
  }

  /**
   * Lazy load unlocked badges
   * @param badges
   * @param areaOfExpertise
   * @private
   */
  private lazyLoadBadgeUnlocked(
    badges: IBadge[],
    areaOfExpertise: AreaOfExpertise
  ): void {
    if (!badges?.length || !this.authData) return;
    const badgeIds = badges.map(badge => badge.id);
    this.rankService.getAchievementByBadgeIds(this.authData.id, badgeIds)
      .then(achievements => this.updateBadgeUnlockedStatus(achievements, areaOfExpertise));
  }

  /**
   * Update status of unlocked badges
   * @param achievements
   * @param areaOfExpertise
   * @private
   */
  private updateBadgeUnlockedStatus(
    achievements: IAchievement[],
    areaOfExpertise: AreaOfExpertise
  ): void {
    if (!achievements?.length || !areaOfExpertise) return;

    for (const achievement of achievements) {
      let existBadgeIndex: number = -1;
      if (areaOfExpertise === AreaOfExpertise.EMOTION) {
        existBadgeIndex = this.emotionBadges.findIndex(badge => badge.id === achievement.badge_id?.id);
      } else if (areaOfExpertise === AreaOfExpertise.CONFLICT) {
        existBadgeIndex = this.conflictBadges.findIndex(badge => badge.id === achievement.badge_id?.id);
      } else if (areaOfExpertise === AreaOfExpertise.COMMUNICATION) {
        existBadgeIndex = this.communicationBadges.findIndex(badge => badge.id === achievement.badge_id?.id);
      } else if (areaOfExpertise === AreaOfExpertise.DISCOVERY) {
        existBadgeIndex = this.discoveryBadges.findIndex(badge => badge.id === achievement.badge_id?.id);
      }

      if (existBadgeIndex < 0) continue;
      if (areaOfExpertise === AreaOfExpertise.EMOTION) {
        this.emotionBadges[existBadgeIndex].unlocked = true;
      } else if (areaOfExpertise === AreaOfExpertise.CONFLICT) {
        this.conflictBadges[existBadgeIndex].unlocked = true;
      } else if (areaOfExpertise === AreaOfExpertise.COMMUNICATION) {
        this.communicationBadges[existBadgeIndex].unlocked = true;
      } else if (areaOfExpertise === AreaOfExpertise.DISCOVERY) {
        this.discoveryBadges[existBadgeIndex].unlocked = true;
      }
    }

    this.changeDetectorRef.detectChanges();
  }
}
