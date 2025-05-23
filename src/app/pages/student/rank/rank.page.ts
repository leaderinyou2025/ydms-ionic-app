import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, RefresherCustomEvent, SegmentValue } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { RankService } from '../../../services/rank/rank.service';
import { IHeaderAnimation, IHeaderAnimeImage, IHeaderSegment } from '../../../shared/interfaces/header/header';
import { IBadge, ILeadership } from '../../../shared/interfaces/rank/rank.interfaces';
import { IAuthData } from '../../../shared/interfaces/auth/auth-data';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonConstants } from '../../../shared/classes/common-constants';

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
  leadershipList!: ILeadership[];
  userLeadership?: ILeadership;
  achievements!: IBadge[];

  @ViewChild('rankTableBody') rankTableBody!: ElementRef;
  isCurrentUserVisible: boolean = false;

  private paged: number = 1;
  private readonly limit = 20;

  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private rankService: RankService,
    private authService: AuthService,
    private route: ActivatedRoute,
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

    }
  }

  /**
   * Load more data
   * @param event
   */
  public loadMoreRankData(event: InfiniteScrollCustomEvent): void {
    if (this.isLoading) {
      event.target.complete();
      return;
    }

    if (this.activeTab === 'rank') {
      // Ngừng load thêm khi đã đến trang cuối cùng
      if (this.leadershipList?.length < ((this.paged - 1) * this.limit)) {
        event.target.complete();
        return;
      }

      this.paged += 1;
      this.loadLeadershipList().finally(() => event.target.complete());
    } else if (this.activeTab === 'achievements') {

    }
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
  public shouldShowFixedUserLeadership(): boolean {
    const currentUser = this.userLeadership;
    if (!currentUser) return false;

    // If user is already visible in the list, hide fixed current user
    if (this.isCurrentUserVisible) {
      return false;
    }

    // Show if position is in the list but not currently visible
    return currentUser.ranking >= 4; // Only show for users not in top 3
  }

  /**
   * Load rank data
   * @param isRefresh
   * @private
   */
  private async loadRankData(isRefresh = false): Promise<void> {
    if (isRefresh) {
      this.paged = 1;
      this.leadershipList = new Array<ILeadership>();
    }
    this.loadCurrentLeadership();
    await this.loadLeadershipList();
  }

  /**
   * Load leadership list
   * @private
   */
  private async loadLeadershipList(): Promise<void> {
    if (this.isLoading || !this.authData) return;
    this.isLoading = true;

    const offset = (this.paged - 1) * this.limit;
    const results = await this.rankService.getLeadershipListIgnoreCurrent(
      this.authData.id, offset, this.limit
    );

    this.leadershipList = CommonConstants.mergeArrayObjectById(this.leadershipList, results) || [];
    this.lazyLoadTeenagerAvatar(results);
    this.activeTab = 'rank';
    this.isLoading = false;
  }

  /**
   * Load current user leadership
   * @private
   */
  private loadCurrentLeadership(): void {
    if (!this.authData) return;
    this.rankService.getLeadershipByTeenagerId(this.authData.id)
      .then(leadership => {
        this.userLeadership = leadership;
        if (leadership) this.lazyLoadTeenagerAvatar([leadership]);
      });
  }

  /**
   * Lazy load teenager avatar image
   * @param leaderships
   * @private
   */
  private lazyLoadTeenagerAvatar(leaderships: Array<ILeadership>): void {
    if (!leaderships?.length) return;
    const teenagerIds = leaderships.map(item => item.teenager_id.id);
    this.rankService.loadTeenagerAvatarResource(teenagerIds).then(teenagerAvatars => {
      for (const teenagerAvatar of teenagerAvatars) {
        const isCurrentUser = teenagerAvatar.id === this.userLeadership?.teenager_id.id;
        let existLeadershipIndex = this.leadershipList.findIndex(u => u.teenager_id.id === teenagerAvatar.id);

        if (!isCurrentUser && existLeadershipIndex < 0) continue;

        if (!teenagerAvatar.avatar) {
          (isCurrentUser && this.userLeadership) ?
            this.userLeadership.avatar = CommonConstants.defaultUserAvatarImage :
            this.leadershipList[existLeadershipIndex].avatar = CommonConstants.defaultUserAvatarImage;
          continue;
        }

        const avatar = this.rankService.getAvatarResource(teenagerAvatar.avatar?.id);

        if (isCurrentUser && this.userLeadership) {
          this.userLeadership.avatar = avatar?.resource_url || CommonConstants.defaultUserAvatarImage;
          continue;
        }

        this.leadershipList[existLeadershipIndex].avatar = avatar?.resource_url || CommonConstants.defaultUserAvatarImage;
      }
    });
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
}
