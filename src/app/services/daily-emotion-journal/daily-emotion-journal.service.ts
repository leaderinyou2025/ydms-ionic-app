import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { OdooService } from '../odoo/odoo.service';
import { StorageService } from '../storage/storage.service';
import { ModelName } from '../../shared/enums/model-name';
import { StorageKey } from '../../shared/enums/storage-key';
import {
  IDailyEmotionJournal,
  IEmotionIcon,
  IEmotionShareTarget,
  IEmotionStreakStatus,
  EmotionShareTargetType
} from '../../shared/interfaces/daily-emotion-journal/daily-emotion-journal.interfaces';
import { ForceTestData } from '../../shared/classes/force-test-data';

@Injectable({
  providedIn: 'root'
})
export class DailyEmotionJournalService {
  private journalEntries = new BehaviorSubject<IDailyEmotionJournal[]>([]);
  private emotionIcons = new BehaviorSubject<IEmotionIcon[]>([]);
  private streakStatus = new BehaviorSubject<IEmotionStreakStatus | null>(null);
  private isLoading = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private odooService: OdooService,
    private storageService: StorageService
  ) {
    this.loadJournalEntries();
    this.loadEmotionIcons();
    this.loadStreakStatus();
  }

  /**
   * Get journal entries as observable
   */
  public getJournalEntries(): Observable<IDailyEmotionJournal[]> {
    return this.journalEntries.asObservable();
  }

  /**
   * Get emotion icons as observable
   */
  public getEmotionIcons(): Observable<IEmotionIcon[]> {
    return this.emotionIcons.asObservable();
  }

  /**
   * Get streak status as observable
   */
  public getStreakStatus(): Observable<IEmotionStreakStatus | null> {
    return this.streakStatus.asObservable();
  }

  /**
   * Get loading status as observable
   */
  public getLoadingStatus(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  /**
   * Load journal entries
   */
  public async loadJournalEntries(): Promise<void> {
    this.isLoading.next(true);
    try {
      // TODO: Implement Odoo API integration
      // const authData = await this.authService.getAuthData();
      // if (!authData?.id) {
      //   throw new Error('User not authenticated');
      // }
      //
      // const entries = await this.odooService.searchRead<IDailyEmotionJournal>(
      //   ModelName.DAILY_EMOTION_JOURNAL,
      //   [['user_id', '=', authData.id]],
      //   ['id', 'date', 'emotion_icon_id', 'caption', 'shared_with'],
      //   0,
      //   100,
      //   'date desc'
      // );
      //
      // if (entries?.length) {
      //   this.journalEntries.next(entries);
      // }

      // Use mock data from ForceTestData
      try {
        const entries = ForceTestData.dailyEmotionJournalEntries;
        this.journalEntries.next(entries);
      } catch (mockError) {
        console.error('ERROR loading mock data:', mockError);
        this.journalEntries.next([]);
      }
    } catch (error) {
      console.error('ERROR loading journal entries:', error);
      this.journalEntries.next([]);
    } finally {
      this.isLoading.next(false);
    }
  }

  /**
   * Load emotion icons
   */
  public async loadEmotionIcons(): Promise<void> {
    try {
      // TODO: Implement Odoo API integration
      // const icons = await this.odooService.searchRead<IEmotionIcon>(
      //   ModelName.EMOTION_ICON,
      //   [],
      //   ['id', 'name', 'icon_url', 'description'],
      //   0,
      //   100
      // );
      //
      // if (icons?.length) {
      //   this.emotionIcons.next(icons);
      // }

      // Use mock data from ForceTestData
      const icons = ForceTestData.emotionIcons;
      this.emotionIcons.next(icons);
    } catch (error) {
      console.error('ERROR:', error);
    }
  }

  /**
   * Get emotion icons as array
   * @returns Promise that resolves to array of emotion icons
   */
  public async getEmotionIconsArray(): Promise<IEmotionIcon[]> {
    try {
      // Make sure icons are loaded
      if (!this.emotionIcons.getValue() || this.emotionIcons.getValue().length === 0) {
        await this.loadEmotionIcons();
      }

      // Return the current value
      return this.emotionIcons.getValue() || [];
    } catch (error) {
      console.error('ERROR getting emotion icons:', error);
      return [];
    }
  }

  /**
   * Load streak status
   */
  public async loadStreakStatus(): Promise<void> {
    try {
      // TODO: Implement Odoo API integration
      // const authData = await this.authService.getAuthData();
      // if (!authData?.id) {
      //   throw new Error('User not authenticated');
      // }
      //
      // const result = await this.odooService.callKw(
      //   ModelName.DAILY_EMOTION_JOURNAL,
      //   'get_streak_status',
      //   [{ user_id: authData.id }]
      // );
      //
      // if (result) {
      //   this.streakStatus.next(result);
      //   await this.storageService.set(StorageKey.EMOTION_STREAK_STATUS, result);
      // } else {
      //   const cachedStatus = await this.storageService.get<IEmotionStreakStatus>(StorageKey.EMOTION_STREAK_STATUS);
      //   if (cachedStatus) {
      //     this.streakStatus.next(cachedStatus);
      //   }
      // }

      // Use mock data from ForceTestData
      try {
        const status = ForceTestData.emotionStreakStatus;
        this.streakStatus.next(status);
        // Skip storage operation to avoid OperationError
        // await this.storageService.set(StorageKey.EMOTION_STREAK_STATUS, status);
      } catch (mockError) {
        console.error('ERROR loading mock streak status:', mockError);
      }
    } catch (error) {
      console.error('ERROR:', error);
      // Skip loading from cache to avoid OperationError
      // const cachedStatus = await this.storageService.get<IEmotionStreakStatus>(StorageKey.EMOTION_STREAK_STATUS);
      // if (cachedStatus) {
      //   this.streakStatus.next(cachedStatus);
      // }
    }
  }

  /**
   * Check if a date already has an entry
   * @param date Date to check
   * @returns Promise that resolves to true if date has entry, false otherwise
   */
  public async hasEntryForDate(date: Date): Promise<boolean> {
    if (!date) {
      console.error('ERROR: Invalid date provided to hasEntryForDate');
      return false;
    }

    try {
      const entries = this.journalEntries.getValue();
      if (!entries || entries.length === 0) {
        return false;
      }

      const hasEntry = entries.some(entry => {
        try {
          if (!entry || !entry.date) return false;

          const entryDate = new Date(entry.date);
          const sameDay = entryDate.getDate() === date.getDate();
          const sameMonth = entryDate.getMonth() === date.getMonth();
          const sameYear = entryDate.getFullYear() === date.getFullYear();
          const result = sameDay && sameMonth && sameYear;
          return result;
        } catch (entryError) {
          console.error('ERROR comparing entry date:', entryError);
          return false;
        }
      });
      return hasEntry;
    } catch (error) {
      console.error('ERROR checking if date has entry:', error);
      return false;
    }
  }

  /**
   * Create new journal entry
   * @param emotionIconId Emotion icon ID
   * @param caption Caption text
   * @param sharedWith Array of share targets
   * @param date Date for the entry (defaults to current date)
   */
  public async createJournalEntry(
    emotionIconId: number,
    caption?: string,
    sharedWith?: IEmotionShareTarget[],
    date: Date = new Date()
  ): Promise<boolean> {
    this.isLoading.next(true);
    try {
      // TODO: Implement Odoo API integration
      // const authData = await this.authService.getAuthData();
      // if (!authData?.id) {
      //   throw new Error('User not authenticated');
      // }
      //
      // const result = await this.odooService.create<IDailyEmotionJournal>(
      //   ModelName.DAILY_EMOTION_JOURNAL,
      //   {
      //     emotion_icon_id: emotionIconId,
      //     caption: caption,
      //     shared_with: sharedWith?.map(target => target.id),
      //     user_id: authData.id
      //   }
      // );
      //
      // if (result) {
      //   await this.loadJournalEntries();
      //   await this.loadStreakStatus();
      //   return true;
      // }
      // return false;

      // Mock implementation
      try {
        const authData = ForceTestData.authData;
        if (!authData?.id) {
          throw new Error('User not authenticated');
        }

        const emotionIcon = ForceTestData.emotionIcons.find(icon => icon.id === emotionIconId);
        if (!emotionIcon) {
          throw new Error('Emotion icon not found');
        }

        // Check if date is today
        const today = new Date();
        const isToday = date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear();

        if (!isToday) {
          console.error('ERROR: Can only add entry for today');
          return false;
        }

        // Check if date already has an entry
        try {
          const hasEntry = await this.hasEntryForDate(date);
          if (hasEntry) {
            console.error('ERROR: Date already has an entry');
            return false;
          }
        } catch (checkError) {
          console.error('ERROR checking if date has entry:', checkError);
          // Continue execution even if check fails
        }

        const newEntry: IDailyEmotionJournal = {
          id: Date.now(),
          date: date,
          emotionIcon: emotionIcon,
          caption: caption,
          sharedWith: sharedWith || [],
          userId: authData.id
        };

        try {
          // Update the BehaviorSubject
          const currentEntries = this.journalEntries.getValue() || [];
          this.journalEntries.next([newEntry, ...currentEntries]);

          // Also update the mock data so it persists
          ForceTestData.dailyEmotionJournalEntries = [newEntry, ...ForceTestData.dailyEmotionJournalEntries];
        } catch (entriesError) {
          console.error('ERROR updating journal entries:', entriesError);
          return false;
        }

        // Update streak status in memory and ForceTestData
        try {
          const currentStatus = this.streakStatus.getValue();
          if (currentStatus) {
            const updatedStatus: IEmotionStreakStatus = {
              ...currentStatus,
              currentStreak: currentStatus.currentStreak + 1,
              longestStreak: Math.max(currentStatus.longestStreak, currentStatus.currentStreak + 1),
              streakMilestones: {
                ...currentStatus.streakMilestones,
                days3: currentStatus.currentStreak + 1 >= 3,
                days5: currentStatus.currentStreak + 1 >= 5,
                days7: currentStatus.currentStreak + 1 >= 7,
                days15: currentStatus.currentStreak + 1 >= 15,
                days28: currentStatus.currentStreak + 1 >= 28
              }
            };

            // Update BehaviorSubject
            this.streakStatus.next(updatedStatus);

            // Also update ForceTestData
            ForceTestData.emotionStreakStatus = updatedStatus;
          }
        } catch (streakError) {
          console.error('ERROR handling streak status:', streakError);
          // Continue execution even if streak update fails
        }

        return true;
      } catch (mockError) {
        console.error('ERROR in mock implementation:', mockError);
        return false;
      }
    } catch (error) {
      console.error('ERROR creating journal entry:', error);
      return false;
    } finally {
      try {
        this.isLoading.next(false);
      } catch (loadingError) {
        console.error('ERROR updating loading status:', loadingError);
      }
    }
  }

  /**
   * Get available share targets
   */
  public async getAvailableShareTargets(): Promise<IEmotionShareTarget[]> {
    try {
      // TODO: Implement Odoo API integration
      // const authData = await this.authService.getAuthData();
      // if (!authData?.id) {
      //   throw new Error('User not authenticated');
      // }
      //
      // const result = await this.odooService.callKw(
      //   ModelName.DAILY_EMOTION_JOURNAL,
      //   'get_available_share_targets',
      //   [{ user_id: authData.id }]
      // );
      //
      // return result || [];

      // Mock implementation
      return [
        { id: 1, type: EmotionShareTargetType.CLASS_GROUP, name: 'Lớp 6A' },
        { id: 2, type: EmotionShareTargetType.FRIEND, name: 'Bạn thân' },
        { id: 3, type: EmotionShareTargetType.FAMILY, name: 'Mẹ' },
        { id: 4, type: EmotionShareTargetType.TEACHER, name: 'Giáo viên' },
        { id: 5, type: EmotionShareTargetType.FAMILY, name: 'Bố' },
        { id: 6, type: EmotionShareTargetType.FRIEND, name: 'Bạn học' }
      ];
    } catch (error) {
      console.error('ERROR:', error);
      return [];
    }
  }
}
