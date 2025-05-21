import { IBase } from '../base/base';

/**
 * Interface for family conflict improvement challenge history item
 */
export interface IFamilyConflictImprovementChallengeHistory extends IBase {
  date: Date;
  title: string;
  status: ChallengeStatus;
  progress: number;
  goalId?: number;
  customGoal?: string;
  completionDate?: Date;
  badgeEarned?: string;
}

/**
 * Interface for family conflict improvement challenge detail
 */
export interface IFamilyConflictImprovementChallengeDetail extends IBase {
  date: Date;
  title: string;
  description?: string;
  status: ChallengeStatus;
  progress: number;
  goalId?: number;
  customGoal?: string;
  completionDate?: Date;
  badgeEarned?: string;
  progressUpdates: IFamilyConflictImprovementChallengeProgressUpdate[];
}

/**
 * Interface for family conflict improvement challenge progress update
 */
export interface IFamilyConflictImprovementChallengeProgressUpdate extends IBase {
  date: Date;
  progress: number;
  notes: string;
}

/**
 * Interface for family conflict improvement challenge goal
 */
export interface IFamilyConflictImprovementChallengeGoal extends IBase {
  title: string;
  description: string;
}

/**
 * Enum for challenge status
 */
export enum ChallengeStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}
