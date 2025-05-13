import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import {AuthService} from '../auth/auth.service';
import {OdooService, SearchDomain} from '../odoo/odoo.service';
import {EmotionFilterType, EmotionType} from '../../shared/enums/personal-diary/personal-diary.enum';
import {
  IPersonalDiaryEntry,
  IEmotionSuggestion,
  IReactionCount,
  IUserReaction
} from '../../shared/interfaces/personal-diary/personal-diary.interfaces';
import {IAuthData} from '../../shared/interfaces/auth/auth-data';
import {ForceTestData} from '../../shared/classes/force-test-data';
import {ModelName} from '../../shared/enums/model-name';
import {OrderBy} from '../../shared/enums/order-by';

@Injectable({
  providedIn: 'root'
})
export class PersonalDiaryService {
  private diaryEntries = new BehaviorSubject<IPersonalDiaryEntry[]>([]);
  private emotionSuggestions = new BehaviorSubject<IEmotionSuggestion[]>([]);
  private currentUser: IAuthData | undefined;

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private odooService: OdooService
  ) {
    this.authService.getAuthData().then(authData => {
      this.currentUser = authData;
      this.loadEmotionDiaryData();
    });
  }

  /**
   * Get diary entries based on filter type
   * @param filterType Filter type (my entries or shared entries)
   * @returns Observable of filtered diary entries
   */
  public getDiaryEntries(filterType: EmotionFilterType): Observable<IPersonalDiaryEntry[]> {
    return new Observable<IPersonalDiaryEntry[]>(observer => {
      this.diaryEntries.subscribe(entries => {
        if (filterType === EmotionFilterType.MY_ENTRIES) {
          observer.next(entries.filter(entry => entry.user.id === this.currentUser?.id));
        } else {
          observer.next(entries.filter(entry => entry.user.id !== this.currentUser?.id && entry.isPublic));
        }
      });
    });
  }

  /**
   * Get emotion suggestions for a specific emotion type
   * @param emotionType Emotion type
   * @returns Emotion suggestions
   */
  public getEmotionSuggestions(emotionType: EmotionType): IEmotionSuggestion | undefined {
    return this.emotionSuggestions.value.find(suggestion => suggestion.emotionType === emotionType);
  }

  /**
   * Add a reaction to a diary entry
   * @param entryId Entry ID
   * @param reactionType Reaction type (love, happy, sad, angry)
   * @returns Boolean indicating if the reaction was added successfully
   */
  public async addReaction(entryId: number, reactionType: string): Promise<boolean> {
    if (!this.currentUser) return false;

    try {
      // Call API to get entry
      // const entryResult = await this.odooService.read<IPersonalDiaryEntry>(
      //   ModelName.EMOTION_DIARY_ENTRIES,
      //   [entryId],
      //   ['id', 'reactions', 'userReactions', 'likes']
      // );
      // const entryToUpdate = entryResult?.[0];

      // For now, get the entry from local state
      const currentEntries = this.diaryEntries.value;
      const entryToUpdate = currentEntries.find(entry => entry.id === entryId);

      if (!entryToUpdate) {
        console.error(`Entry with ID ${entryId} not found`);
        return false;
      }

      // Initialize reactions and userReactions if they don't exist
      const reactions = entryToUpdate.reactions || {love: 0, happy: 0, sad: 0, angry: 0};
      const userReactions = entryToUpdate.userReactions || [];

      // Check if user has already reacted to this entry
      const existingReaction = userReactions.find(reaction => reaction.userId === this.currentUser!.id);

      let updatedReactions: IReactionCount;
      let updatedUserReactions: IUserReaction[];
      let updatedLikes: number;

      if (existingReaction) {
        // User has already reacted - if it's the same reaction, remove it
        if (existingReaction.reactionType === reactionType) {
          console.log(`Removing reaction ${reactionType} for user ${this.currentUser.id} on entry ${entryId}`);

          // Remove user from userReactions
          updatedUserReactions = userReactions.filter(reaction => reaction.userId !== this.currentUser!.id);

          // Decrement the reaction count
          updatedReactions = {
            ...reactions,
            [reactionType]: Math.max(0, (reactions[reactionType as keyof IReactionCount] || 0) - 1)
          };

          // For backward compatibility, update likes count if needed
          updatedLikes = reactionType === 'love' ? Math.max(0, entryToUpdate.likes - 1) : entryToUpdate.likes;
        } else {
          // User is changing their reaction - remove the old one first
          console.log(`Changing reaction from ${existingReaction.reactionType} to ${reactionType} for user ${this.currentUser.id} on entry ${entryId}`);

          const oldReactionType = existingReaction.reactionType;

          // Decrement the old reaction count
          updatedReactions = {
            ...reactions,
            [oldReactionType]: Math.max(0, (reactions[oldReactionType as keyof IReactionCount] || 0) - 1)
          };

          // Update the user's reaction type
          existingReaction.reactionType = reactionType;
          updatedUserReactions = [...userReactions]; // Create a new array reference

          // Increment the new reaction count
          updatedReactions[reactionType as keyof IReactionCount] =
            (updatedReactions[reactionType as keyof IReactionCount] || 0) + 1;

          // For backward compatibility, update likes count
          updatedLikes = entryToUpdate.likes;
          if (oldReactionType === 'love') updatedLikes = Math.max(0, updatedLikes - 1);
          if (reactionType === 'love') updatedLikes += 1;
        }
      } else {
        // User hasn't reacted yet - add a new reaction
        console.log(`Adding new reaction ${reactionType} for user ${this.currentUser.id} on entry ${entryId}`);

        // Update the specific reaction count
        updatedReactions = {
          ...reactions,
          [reactionType]: (reactions[reactionType as keyof IReactionCount] || 0) + 1
        };

        // Add user to the list of users who reacted
        updatedUserReactions = [...userReactions, {
          userId: this.currentUser.id,
          reactionType
        }];

        // For backward compatibility, also update the likes count for 'love' reactions
        updatedLikes = reactionType === 'love' ? entryToUpdate.likes + 1 : entryToUpdate.likes;
      }

      // Prepare the values to update in the API
      const updateValues = {
        reactions: updatedReactions,
        likes: updatedLikes,
        userReactions: updatedUserReactions
      };

      // Call API to update entry
      // const updateResult = await this.odooService.write<Partial<IPersonalDiaryEntry>>(
      //   ModelName.EMOTION_DIARY_ENTRIES,
      //   [entryId],
      //   updateValues
      // );
      //
      // if (!updateResult) {
      //   console.error(`Failed to update entry ${entryId}`);
      //   return false;
      // }

      // For now, update the entry in local state
      const updatedEntries = this.diaryEntries.value.map(entry => {
        if (entry.id === entryId) {
          return {
            ...entry,
            reactions: updatedReactions,
            likes: updatedLikes,
            userReactions: updatedUserReactions
          };
        }
        return entry;
      });

      this.diaryEntries.next(updatedEntries);
      console.log(`Successfully updated reaction for entry ${entryId}`);
      return true;
    } catch (error) {
      console.error(`Error updating reaction for entry ${entryId}:`, error);
      return false;
    }
  }

  /**
   * Get reactions for an entry
   * @param entryId Entry ID
   * @returns Reactions object
   */
  public getReactions(entryId: number): IReactionCount | undefined {
    const entry = this.diaryEntries.value.find(e => e.id === entryId);
    return entry?.reactions;
  }

  /**
   * Get user's reaction to an entry
   * @param entryId Entry ID
   * @returns User's reaction type or null if not reacted
   */
  public getUserReaction(entryId: number): string | null {
    if (!this.currentUser) return null;

    const entry = this.diaryEntries.value.find(e => e.id === entryId);
    if (!entry || !entry.userReactions) return null;

    const userReaction = entry.userReactions.find(r => r.userId === this.currentUser!.id);
    return userReaction ? userReaction.reactionType : null;
  }

  /**
   * Get total reactions count for an entry
   * @param entryId Entry ID
   * @returns Total reactions count
   */
  public getTotalReactionsCount(entryId: number): number {
    const entry = this.diaryEntries.value.find(e => e.id === entryId);
    if (!entry || !entry.reactions) return entry?.likes || 0;

    return Object.values(entry.reactions).reduce((sum, count) => sum + count, 0);
  }

  /**
   * Add a new diary entry
   * @param content Entry content
   * @param emotionType Emotion type
   * @param isAnonymous Whether the entry is anonymous
   * @param isPublic Whether the entry is public
   * @returns Promise with the new diary entry
   */
  public async addDiaryEntry(
    content: string,
    emotionType: EmotionType,
    isAnonymous: boolean = false,
    isPublic: boolean = false
  ): Promise<IPersonalDiaryEntry | undefined> {
    if (!this.currentUser) return undefined;

    try {
      /* TODO: Implement Odoo API integration
      // Prepare the entry data for API
      const entryData: Partial<IPersonalDiaryEntry> = {
        content,
        emotionType,
        isAnonymous,
        isPublic,
        timestamp: new Date(),
        user: this.currentUser
      };

      // Call the Odoo service to create the entry
      const newEntryId = await this.odooService.create<IPersonalDiaryEntry>(
        ModelName.EMOTION_DIARY_ENTRIES,
        entryData
      );

      if (!newEntryId) {
        return undefined;
      }
      */

      // Create a local entry
      const newEntry: IPersonalDiaryEntry = {
        id: this.generateId(),
        user: this.currentUser,
        content,
        emotionType,
        timestamp: new Date(),
        isAnonymous,
        isPublic,
        likes: 0
      };

      // Update the local state
      const currentEntries = this.diaryEntries.value;
      this.diaryEntries.next([newEntry, ...currentEntries]);

      return newEntry;
    } catch (error) {
      console.error("ERROR:", error);
      return undefined;
    }
  }

  /**
   * Withdraw a diary entry
   * @param entryId Entry ID
   * @returns Promise with whether the operation was successful
   */
  public async withdrawEntry(entryId: number): Promise<boolean> {
    try {
      const currentEntries = this.diaryEntries.value;
      const entryToWithdraw = currentEntries.find(entry => entry.id === entryId);

      if (!entryToWithdraw || entryToWithdraw.user.id !== this.currentUser?.id) {
        return false;
      }

      /* TODO: Implement Odoo API integration
      // Call the Odoo service to unlink (delete) the entry
      const unlinkResult = await this.odooService.unlink(
        ModelName.EMOTION_DIARY_ENTRIES,
        [entryId]
      );

      if (!unlinkResult) {
        return false;
      }
      */

      // Update local state
      const updatedEntries = currentEntries.filter(entry => entry.id !== entryId);
      this.diaryEntries.next(updatedEntries);

      return true;
    } catch (error) {
      console.error("ERROR:", error);
      return false;
    }
  }

  /**
   * Generate a unique ID for a new entry
   * @returns New ID
   */
  private generateId(): number {
    const currentEntries = this.diaryEntries.value;
    return currentEntries.length ? Math.max(...currentEntries.map(entry => entry.id)) + 1 : 1;
  }

  /**
   * Load data from API or use mock data as fallback
   */
  /**
   * Load data from mock data
   */
  private async loadEmotionDiaryData(): Promise<void> {
    try {
      /* TODO: Implement Odoo API integration
      try {
        // Call API to get diary entries
        const diaryEntriesResult = await this.odooService.searchRead<IPersonalDiaryEntry>(
          ModelName.EMOTION_DIARY_ENTRIES,
          [],
          [],
          0,
          0
        );

        if (diaryEntriesResult?.length) {
          this.diaryEntries.next(diaryEntriesResult);
        } else {
          throw new Error('No diary entries returned from API');
        }
      } catch (apiError) {
        // Use mock data if API fails
      }

      try {
        const suggestionsResult = await this.odooService.searchRead<IEmotionSuggestion>(
          ModelName.EMOTION_SUGGESTIONS,
          [],
          [],
          0,
          0
        );

        if (suggestionsResult?.length) {
          this.emotionSuggestions.next(suggestionsResult);
        } else {
          throw new Error('No emotion suggestions returned from API');
        }
      } catch (apiError) {
        // Use mock data if API fails
      }
      */

      // Load diary entries from mock data
      const entries = ForceTestData.personalDiaryEntries.map(entry => {
        // Replace current user with the actual current user
        if (entry.user.id === this.currentUser?.id) {
          return {...entry, user: this.currentUser};
        }
        return entry;
      });
      this.diaryEntries.next(entries);

      // Load emotion suggestions from mock data
      const suggestions = ForceTestData.emotionSuggestions;
      this.emotionSuggestions.next(suggestions);
    } catch (error) {
      console.error("ERROR:", error)
    }
  }
}
