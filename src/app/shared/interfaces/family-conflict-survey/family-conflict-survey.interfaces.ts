import { IBase } from '../base/base';

/**
 * Interface for family conflict survey history item
 */
export interface IFamilyConflictSurveyHistory extends IBase {
  date: Date;
  result: string;
  conflictLevel: string;
  score: number;
}

/**
 * Interface for family conflict survey question
 */
export interface IFamilyConflictSurveyQuestion {
  id: number;
  text: string;
  options: IFamilyConflictSurveyOption[];
}

/**
 * Interface for family conflict survey option
 */
export interface IFamilyConflictSurveyOption {
  id: number;
  text: string;
  selected: boolean;
  value: number;
}

/**
 * Interface for family conflict survey detail
 */
export interface IFamilyConflictSurveyDetail extends IBase {
  date: Date;
  questions: IFamilyConflictSurveyQuestion[];
  result: string;
  conflictLevel: string;
  score: number;
  feedback: string;
}
