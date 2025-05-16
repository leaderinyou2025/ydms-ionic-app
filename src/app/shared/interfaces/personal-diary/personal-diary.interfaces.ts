import { IBase } from '../base/base';
import { IAuthData } from '../auth/auth-data';
import { EmotionType, EmotionFilterType } from '../../../shared/enums/personal-diary/personal-diary.enum';

/**
 * Interface for reaction count
 */
export interface IReactionCount {
  love: number;
  happy: number;
  sad: number;
  angry: number;
}

/**
 * Interface for user reaction
 */
export interface IUserReaction {
  userId: number;
  reactionType: string;
}

/**
 * Interface for personal diary entry
 */
export interface IPersonalDiaryEntry extends IBase {
  user: IAuthData;
  content: string;
  emotionType: EmotionType;
  timestamp: Date;
  isAnonymous: boolean;
  isPublic: boolean;
  likes: number;
  reactions?: IReactionCount;
  userReactions?: IUserReaction[];
}

/**
 * Interface for emotion suggestion
 */
export interface IEmotionSuggestion {
  id: number;
  emotionType: EmotionType;
  suggestions: string[];
}

/**
 * Interface for emotion options
 */
export interface EmotionOption {
  value: EmotionType;
  emoji: string;
  label: string;
  bgClass: string;
}

/**
 * Interface for reaction option
 */
export interface ReactionOption {
  emoji: string;
  name: string;
  label: string;
}


