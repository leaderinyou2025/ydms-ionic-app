import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SegmentValue } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { IRankItem } from '../../../shared/interfaces/rank/rank.interfaces';
import { IAchievementCategory } from '../../../shared/interfaces/rank/achievement.interfaces';
import { RankService } from '../../../services/rank/rank.service';
import { IHeaderAnimation, IHeaderAnimeImage, IHeaderSegment } from '../../../shared/interfaces/header/header';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.page.html',
  styleUrls: ['./rank.page.scss'],
  standalone: false,
})
export class RankPage implements OnInit, AfterViewInit, OnDestroy {

  isLoading: boolean = false;
  rankList: IRankItem[] = [];
  userRank: IRankItem | undefined;
  achievements: IAchievementCategory[] = [];

  activeTab!: 'rank' | 'achievements';
  segment!: IHeaderSegment;
  animeImage!: IHeaderAnimeImage;
  animation!: IHeaderAnimation;

  @ViewChild('rankTableBody') rankTableBody!: ElementRef;
  isCurrentUserVisible: boolean = false;

  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private rankService: RankService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.activeTab = params['activeTab'] || 'rank';
      this.initHeader();
    });
    this.loadRankData();
    this.loadAchievements();
  }

  async loadRankData() {
    this.isLoading = true;
    try {
      // Get rank list from API
      const rankList = await this.rankService.fetchRankList();

      // Get current user rank
      const currentUserRank = await this.rankService.fetchCurrentUserRank();

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
      this.achievements = await this.rankService.fetchAchievements();
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  }

  /**
   * Switch between rank and achievements tabs
   * @param tab - The tab to switch to
   */
  switchTab(tab: SegmentValue | undefined) {
    if (tab === 'rank' || tab === 'achievements') {
      this.activeTab = tab as 'rank' | 'achievements';
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
   * Check if current user is visible in the rank list
   */
  checkCurrentUserVisibility() {
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
  shouldShowFixedUserRank(): boolean {
    const currentUser = this.getCurrentUserRank();
    if (!currentUser) return false;

    // If user is already visible in the list, hide fixed current user
    if (this.isCurrentUserVisible) {
      return false;
    }

    // Show if position is in the list but not currently visible
    return currentUser.position >= 4; // Only show for users not in top 3
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
