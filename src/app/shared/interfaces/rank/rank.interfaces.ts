import { ILiyYdmsAchievement } from '../models/liy.ydms.achievement';
import { ILiyYdmsBadge } from '../models/liy.ydms.badge';
import { ILiyYdmsLeadership } from '../models/liy.ydms.leadership';

/**
 * Extended interface for Achievement with client-side properties
 */
export interface IAchievement extends ILiyYdmsAchievement {
}

/**
 * Extended interface for Badge with client-side properties
 */
export interface IBadge extends ILiyYdmsBadge {
}

/**
 * Extended interface for Leadership (Rank) with client-side properties
 */
export interface ILeadership extends ILiyYdmsLeadership {
  avatar?: string;
}
