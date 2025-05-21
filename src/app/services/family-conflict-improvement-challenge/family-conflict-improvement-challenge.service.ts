import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { ModelName } from '../../shared/enums/model-name';
import { OrderBy } from '../../shared/enums/order-by';
import {
  IFamilyConflictImprovementChallengeHistory,
  IFamilyConflictImprovementChallengeDetail,
  IFamilyConflictImprovementChallengeGoal,
  IFamilyConflictImprovementChallengeProgressUpdate,
  ChallengeStatus
} from '../../shared/interfaces/family-conflict-improvement-challenge/family-conflict-improvement-challenge.interfaces';
import { ForceTestData } from '../../shared/classes/force-test-data';

@Injectable({
  providedIn: 'root'
})
export class FamilyConflictImprovementChallengeService {
  private challengeHistory = new BehaviorSubject<IFamilyConflictImprovementChallengeHistory[]>([]);
  private currentChallenge = new BehaviorSubject<IFamilyConflictImprovementChallengeDetail | null>(null);
  private challengeGoals = new BehaviorSubject<IFamilyConflictImprovementChallengeGoal[]>([]);

  constructor(
    private authService: AuthService,
    private odooService: OdooService
  ) {
    this.loadChallengeHistory();
    this.loadChallengeGoals();
  }

  /**
   * Get challenge history as observable
   */
  public getChallengeHistory(): Observable<IFamilyConflictImprovementChallengeHistory[]> {
    return this.challengeHistory.asObservable();
  }

  /**
   * Get current challenge as observable
   */
  public getCurrentChallenge(): Observable<IFamilyConflictImprovementChallengeDetail | null> {
    return this.currentChallenge.asObservable();
  }

  /**
   * Get challenge goals as observable
   */
  public getChallengeGoals(): Observable<IFamilyConflictImprovementChallengeGoal[]> {
    return this.challengeGoals.asObservable();
  }

  /**
   * Load challenge history
   */
  public async loadChallengeHistory(): Promise<void> {
    try {
      // TODO: Implement Odoo API integration
      // const authData = await this.authService.getAuthData();
      // if (!authData?.id) return;
      //
      // const domain: SearchDomain = [
      //   ['user_id', '=', authData.id]
      // ];
      //
      // const fields = ['id', 'date', 'title', 'status', 'progress', 'goal_id', 'custom_goal', 'completion_date', 'badge_earned'];
      // const order = OrderBy.DESC;
      //
      // const results = await this.odooService.searchRead<IFamilyConflictImprovementChallengeHistory>(
      //   ModelName.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE,
      //   domain,
      //   fields,
      //   0,
      //   0,
      //   order
      // );
      //
      // if (results?.length) {
      //   this.challengeHistory.next(results);
      //   return;
      // }

      // Use mock data from ForceTestData
      const mockChallengeHistory = ForceTestData.familyConflictImprovementChallengeHistory.map(challenge => ({
        ...challenge,
        status: challenge.status as ChallengeStatus
      }));

      this.challengeHistory.next(mockChallengeHistory);
    } catch (error) {
      console.error('ERROR:', error);
      this.challengeHistory.next([]);
    }
  }

  /**
   * Load challenge goals
   */
  private async loadChallengeGoals(): Promise<void> {
    try {
      // TODO: Implement Odoo API integration
      // const fields = ['id', 'title', 'description'];
      // const order = OrderBy.ASC;
      //
      // const results = await this.odooService.searchRead<IFamilyConflictImprovementChallengeGoal>(
      //   ModelName.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE_GOAL,
      //   [],
      //   fields,
      //   0,
      //   0,
      //   order
      // );
      //
      // if (results?.length) {
      //   this.challengeGoals.next(results);
      //   return;
      // }

      // Use mock data from ForceTestData
      const mockChallengeGoals = ForceTestData.familyConflictImprovementChallengeGoals;

      this.challengeGoals.next(mockChallengeGoals);
    } catch (error) {
      console.error('ERROR:', error);
      this.challengeGoals.next([]);
    }
  }

  /**
   * Get challenge detail by ID
   * @param challengeId Challenge ID
   */
  public async getChallengeDetail(challengeId: number): Promise<IFamilyConflictImprovementChallengeDetail | null> {
    try {
      // TODO: Implement Odoo API integration
      // const challengeDetailResult = await this.odooService.read<IFamilyConflictImprovementChallengeDetail>(
      //   ModelName.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE_DETAIL,
      //   [challengeId],
      //   ['id', 'date', 'title', 'description', 'status', 'progress', 'goal_id', 'custom_goal', 'completion_date', 'badge_earned', 'progress_updates']
      // );
      //
      // if (challengeDetailResult?.length) {
      //   const challengeDetail = challengeDetailResult[0];
      //   this.currentChallenge.next(challengeDetail);
      //   return challengeDetail;
      // }

      // Use mock data
      const historyItem = this.challengeHistory.value.find(item => item.id === challengeId);
      if (!historyItem) return null;

      // Get progress updates from ForceTestData
      const progressUpdates = ForceTestData.getFamilyConflictImprovementChallengeProgressUpdates(challengeId);

      const mockChallengeDetail: IFamilyConflictImprovementChallengeDetail = {
        ...historyItem,
        description: historyItem.customGoal || this.challengeGoals.value.find(goal => goal.id === historyItem.goalId)?.description || '',
        progressUpdates
      };

      this.currentChallenge.next(mockChallengeDetail);
      return mockChallengeDetail;
    } catch (error) {
      console.error('ERROR:', error);
      return null;
    }
  }

  /**
   * Create a new challenge
   * @param goalId Goal ID (optional if customGoal is provided)
   * @param customGoal Custom goal (optional if goalId is provided)
   */
  public async createNewChallenge(goalId?: number, customGoal?: string): Promise<IFamilyConflictImprovementChallengeDetail | null> {
    try {
      if (!goalId && !customGoal) {
        throw new Error('Either goalId or customGoal must be provided');
      }

      // TODO: Implement Odoo API integration
      // const authData = await this.authService.getAuthData();
      // if (!authData?.id) return null;
      //
      // const newChallengeResult = await this.odooService.callKw(
      //   ModelName.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE,
      //   'create_new_challenge',
      //   [{
      //     user_id: authData.id,
      //     goal_id: goalId,
      //     custom_goal: customGoal
      //   }]
      // );
      //
      // if (newChallengeResult?.id) {
      //   await this.loadChallengeHistory();
      //   return this.getChallengeDetail(newChallengeResult.id);
      // }

      // Use mock data
      let title = '';
      if (goalId) {
        const goal = this.challengeGoals.value.find(g => g.id === goalId);
        if (goal) {
          title = goal.title;
        }
      } else if (customGoal) {
        title = customGoal;
      }

      const newChallenge: IFamilyConflictImprovementChallengeHistory = {
        id: Math.max(...this.challengeHistory.value.map(c => c.id || 0), 0) + 1,
        date: new Date(),
        title,
        status: ChallengeStatus.ACTIVE,
        progress: 0,
        goalId,
        customGoal
      };

      // Update history
      const updatedHistory = [...this.challengeHistory.value, newChallenge];
      this.challengeHistory.next(updatedHistory);

      // Return challenge detail
      return this.getChallengeDetail(newChallenge.id || 0);
    } catch (error) {
      console.error('ERROR:', error);
      return null;
    }
  }

  /**
   * Update challenge progress
   * @param challengeId Challenge ID
   * @param progress Progress percentage (0-100)
   * @param notes Progress notes
   */
  public async updateChallengeProgress(challengeId: number, progress: number, notes: string): Promise<boolean> {
    try {
      if (progress < 0 || progress > 100) {
        throw new Error('Progress must be between 0 and 100');
      }

      // TODO: Implement Odoo API integration
      // const result = await this.odooService.callKw(
      //   ModelName.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE,
      //   'update_progress',
      //   [{
      //     challenge_id: challengeId,
      //     progress,
      //     notes
      //   }]
      // );
      //
      // if (result?.success) {
      //   await this.loadChallengeHistory();
      //   return true;
      // }

      // Use mock data
      const challengeIndex = this.challengeHistory.value.findIndex(c => c.id === challengeId);
      if (challengeIndex === -1) return false;

      const challenge = this.challengeHistory.value[challengeIndex];

      // Update challenge
      const updatedChallenge: IFamilyConflictImprovementChallengeHistory = {
        ...challenge,
        progress,
        status: progress === 100 ? ChallengeStatus.COMPLETED : ChallengeStatus.ACTIVE,
        completionDate: progress === 100 ? new Date() : undefined,
        badgeEarned: progress === 100 ? this.getBadgeForChallenge(challenge) : undefined
      };

      // Update history
      const updatedHistory = [...this.challengeHistory.value];
      updatedHistory[challengeIndex] = updatedChallenge;
      this.challengeHistory.next(updatedHistory);

      // Update current challenge if it's the same one
      const currentChallenge = this.currentChallenge.value;
      if (currentChallenge && currentChallenge.id === challengeId) {
        const newProgressUpdate: IFamilyConflictImprovementChallengeProgressUpdate = {
          id: Math.max(...currentChallenge.progressUpdates.map(p => p.id || 0), 0) + 1,
          date: new Date(),
          progress,
          notes
        };

        const updatedCurrentChallenge: IFamilyConflictImprovementChallengeDetail = {
          ...currentChallenge,
          progress,
          status: progress === 100 ? ChallengeStatus.COMPLETED : ChallengeStatus.ACTIVE,
          completionDate: progress === 100 ? new Date() : undefined,
          badgeEarned: progress === 100 ? this.getBadgeForChallenge(updatedChallenge) : undefined,
          progressUpdates: [...currentChallenge.progressUpdates, newProgressUpdate]
        };

        this.currentChallenge.next(updatedCurrentChallenge);
      }

      return true;
    } catch (error) {
      console.error('ERROR:', error);
      return false;
    }
  }

  /**
   * Abandon challenge
   * @param challengeId Challenge ID
   */
  public async abandonChallenge(challengeId: number): Promise<boolean> {
    try {
      // TODO: Implement Odoo API integration
      // const result = await this.odooService.callKw(
      //   ModelName.FAMILY_CONFLICT_IMPROVEMENT_CHALLENGE,
      //   'abandon_challenge',
      //   [{
      //     challenge_id: challengeId
      //   }]
      // );
      //
      // if (result?.success) {
      //   await this.loadChallengeHistory();
      //   return true;
      // }

      // Use mock data
      const challengeIndex = this.challengeHistory.value.findIndex(c => c.id === challengeId);
      if (challengeIndex === -1) return false;

      // Update challenge
      const updatedChallenge: IFamilyConflictImprovementChallengeHistory = {
        ...this.challengeHistory.value[challengeIndex],
        status: ChallengeStatus.ABANDONED
      };

      // Update history
      const updatedHistory = [...this.challengeHistory.value];
      updatedHistory[challengeIndex] = updatedChallenge;
      this.challengeHistory.next(updatedHistory);

      // Update current challenge if it's the same one
      const currentChallenge = this.currentChallenge.value;
      if (currentChallenge && currentChallenge.id === challengeId) {
        const updatedCurrentChallenge: IFamilyConflictImprovementChallengeDetail = {
          ...currentChallenge,
          status: ChallengeStatus.ABANDONED
        };

        this.currentChallenge.next(updatedCurrentChallenge);
      }

      return true;
    } catch (error) {
      console.error('ERROR:', error);
      return false;
    }
  }

  /**
   * Get badge for completed challenge
   * @param challenge Challenge
   * @private
   */
  private getBadgeForChallenge(challenge: IFamilyConflictImprovementChallengeHistory): string {
    // In a real implementation, this would be determined by the backend
    // For now, return a badge based on the challenge goal
    if (challenge.goalId === 1) {
      return 'Sao Giao Tiếp';
    } else if (challenge.goalId === 2) {
      return 'Người Xây Dựng Hòa Hợp';
    } else if (challenge.goalId === 3) {
      return 'Bậc Thầy Cảm Xúc';
    } else if (challenge.goalId === 4) {
      return 'Chuyên Gia Lắng Nghe';
    } else if (challenge.goalId === 5) {
      return 'Người Giải Quyết Xung Đột';
    } else {
      return 'Nhà Vô Địch Gia Đình';
    }
  }
}
