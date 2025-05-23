import { ILiyYdmsAchievement } from '../models/liy.ydms.achievement';
import { ILiyYdmsBadge } from '../models/liy.ydms.badge';
import { ILiyYdmsLeaderboard } from '../models/liy.ydms.leaderboard';

/**
 * Extended interface for Achievement with client-side properties
 */
export interface IAchievement extends ILiyYdmsAchievement {
}

/**
 * Extended interface for Badge with client-side properties
 */
export interface IBadge extends ILiyYdmsBadge {
  unlocked?: boolean;
}

/**
 * Extended interface for Leaderboard (Rank) with client-side properties
 */
export interface ILeaderboard extends ILiyYdmsLeaderboard {
  avatar?: string;
}
