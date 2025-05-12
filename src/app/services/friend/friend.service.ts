import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ForceTestData } from '../../shared/classes/force-test-data';
import { IFriend } from '../../shared/interfaces/friend/friend';
import { AuthService } from '../auth/auth.service';
import { OdooService } from '../odoo/odoo.service';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(
    private odooService: OdooService,
    private authService: AuthService,
  ) { }

  /**
   * Get friends list with pagination and search
   * @param searchTerm Optional search term
   * @param offset Pagination offset
   * @param limit Pagination limit
   * @returns Observable with list of friends
   */
  public getFriends(
    searchTerm: string = '',
    offset: number = 0,
    limit: number = 20
  ): Observable<{ friends: IFriend[], total: number }> {
    // TODO: Implement actual API call when backend is ready
    // Example of how it would be implemented with real API:
    /*
    const searchDomain: SearchDomain = [];

    // Add search term filter if provided
    if (searchTerm) {
      searchDomain.push(['name', 'ilike', searchTerm]);
    }

    // Get total count for pagination
    const totalPromise = this.odooService.searchCount(ModelName.FRIENDS, searchDomain);

    // Get friends data
    const friendsPromise = this.odooService.searchRead<IFriend>(
      ModelName.FRIENDS,
      searchDomain,
      ['id', 'name', 'avatar', 'likeCount'],
      offset,
      limit,
      OrderBy.NAME_ASC
    );

    // Return combined result
    return from(Promise.all([friendsPromise, totalPromise])).pipe(
      map(([friends, total]) => ({ friends, total }))
    );
    */

    // For now, return test data
    let friends = ForceTestData.friends;

    // Apply search filter if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      friends = friends.filter(friend =>
        friend.name?.toLowerCase().includes(term)
      );
    }

    // Simulate network delay for testing pagination
    return new Observable(observer => {
      setTimeout(() => {
        // Apply pagination
        const paginatedFriends = friends.slice(offset, offset + limit);
        const total = friends.length;

        // Return paginated result
        observer.next({ friends: paginatedFriends, total });
        observer.complete();
      }, 500); // 500ms delay to simulate network request
    });
  }

  /**
   * Get friend details by ID
   * @param friendId The ID of the friend to retrieve
   * @returns Observable with friend details or undefined if not found
   */
  public getFriendById(friendId: number): Observable<IFriend | undefined> {
    // TODO: Implement actual API call when backend is ready
    // Example of how it would be implemented with real API:
    /*
    return from(this.odooService.read<IFriend>(
      ModelName.FRIENDS,
      [friendId],
      ['id', 'name', 'avatar', 'likeCount', 'rank', 'achievements', 'friendshipLevel']
    )).pipe(
      map(results => results && results.length > 0 ? results[0] : undefined)
    );
    */

    // For now, return test data
    const friend = ForceTestData.friends.find(f => f.id === friendId);

    // Simulate network delay
    return of(friend).pipe(delay(300));
  }
}
