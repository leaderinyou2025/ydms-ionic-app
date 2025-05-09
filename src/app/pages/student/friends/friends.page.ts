import { Component, OnInit } from '@angular/core';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../shared/enums/page-routes';
import { FriendService } from '../../../services/friend/friend.service';
import { IFriend } from '../../../shared/interfaces/friend/friend';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  standalone: false
})
export class FriendsPage implements OnInit {

  friends: IFriend[] = [];
  totalFriends: number = 0;
  searchTerm: string = '';

  // Pagination parameters
  currentPage: number = 0;
  pageSize: number = 10;
  hasMoreData: boolean = true;

  constructor(
    private friendService: FriendService
  ) { }

  ngOnInit() {
    this.loadFriends();
  }

  /**
   * Load friends list from service with pagination
   * @param event Infinite scroll event (optional)
   * @param refresh Whether to refresh the list (reset pagination)
   */
  loadFriends(event?: any, refresh: boolean = false) {
    // Reset pagination if refreshing
    if (refresh) {
      this.currentPage = 0;
      this.friends = [];
      this.hasMoreData = true;
    }

    // Calculate offset based on current page and page size
    const offset = this.currentPage * this.pageSize;

    // Call service with pagination parameters
    this.friendService.getFriends(
      this.searchTerm,
      offset,
      this.pageSize
    ).subscribe(result => {
      // If refreshing, replace the list, otherwise append
      if (refresh) {
        this.friends = result.friends;
      } else {
        this.friends = [...this.friends, ...result.friends];
      }

      this.totalFriends = result.total;

      // Check if we've loaded all available data
      this.hasMoreData = this.friends.length < result.total;

      // Complete the infinite scroll event if provided
      if (event) {
        event.target.complete();

        // Disable infinite scroll if no more data
        if (!this.hasMoreData) {
          event.target.disabled = true;
        }
      }
    });
  }

  /**
   * Load more data when scrolling
   * @param event Infinite scroll event
   */
  loadMore(event: any) {
    // Increment page before loading more
    this.currentPage++;
    this.loadFriends(event);
  }

  /**
   * Handle pull-to-refresh
   * @param event Refresh event
   */
  doRefresh(event: any) {
    // Reset and reload data
    this.loadFriends(event, true);
  }

  /**
   * Handle search input changes
   */
  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    // Reset pagination and reload with search term
    this.loadFriends(null, true);
  }

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
}
