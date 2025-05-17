import { IBase } from '../base/base';

/**
 * Interface for daily emotion journal entry
 */
export interface IDailyEmotionJournal extends IBase {
  date: Date;
  emotionIcon: IEmotionIcon;
  caption?: string;
  sharedWith?: IEmotionShareTarget[];
  // userId: number;
}

/**
 * Interface for emotion icon
 */
export interface IEmotionIcon extends IBase {
  name: string;
  iconUrl?: string;
  iconName?: string;
  emoji?: string;
  description?: string;
}

/**
 * Interface for emotion share target
 */
export interface IEmotionShareTarget {
  id: number;
  type: EmotionShareTargetType;
  name: string;
}

/**
 * Interface for emotion streak status
 */
export interface IEmotionStreakStatus {
  currentStreak: number;
  longestStreak: number;
  streakMilestones: {
    days3: boolean;
    days5: boolean;
    days7: boolean;
    days15: boolean;
    days28: boolean;
  };
}

/**
 * Enum for emotion share target type
 */
export enum EmotionShareTargetType {
  CLASS_GROUP = 'class_group',
  FRIEND = 'friend',
  TEACHER = 'teacher',
  FAMILY = 'family'
}
