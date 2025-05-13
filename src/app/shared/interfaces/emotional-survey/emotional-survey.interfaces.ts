import { IBase } from '../base/base';
import { EmotionType } from '../../enums/personal-diary/personal-diary.enum';

/**
 * Interface for emotional survey history item
 */
export interface IEmotionalSurveyHistory extends IBase {
  date: Date;
  result: string;
  emotionType: EmotionType;
  score: number;
}

/**
 * Interface for emotional survey question
 */
export interface IEmotionalSurveyQuestion {
  id: number;
  text: string;
  options: IEmotionalSurveyOption[];
}

/**
 * Interface for emotional survey option
 */
export interface IEmotionalSurveyOption {
  id: number;
  text: string;
  selected: boolean;
  value: number;
}

/**
 * Interface for emotional survey detail
 */
export interface IEmotionalSurveyDetail extends IBase {
  date: Date;
  questions: IEmotionalSurveyQuestion[];
  result: string;
  emotionType: EmotionType;
  score: number;
  feedback: string;
}
