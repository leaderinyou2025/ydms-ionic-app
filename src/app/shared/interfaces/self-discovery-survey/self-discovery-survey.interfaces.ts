import { IBase } from '../base/base';

/**
 * Interface for self discovery survey history item
 */
export interface ISelfDiscoverySurveyHistory extends IBase {
  date: Date;
  result: string;
  discoveryLevel: string;
  score: number;
}

/**
 * Interface for self discovery survey question
 */
export interface ISelfDiscoverySurveyQuestion {
  id: number;
  text: string;
  options: ISelfDiscoverySurveyOption[];
}

/**
 * Interface for self discovery survey option
 */
export interface ISelfDiscoverySurveyOption {
  id: number;
  text: string;
  selected: boolean;
  value: number;
}

/**
 * Interface for self discovery survey detail
 */
export interface ISelfDiscoverySurveyDetail extends IBase {
  date: Date;
  questions: ISelfDiscoverySurveyQuestion[];
  result: string;
  discoveryLevel: string;
  score: number;
  feedback: string;
}
