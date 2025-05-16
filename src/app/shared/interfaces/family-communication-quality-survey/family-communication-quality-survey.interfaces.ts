import { IBase } from '../base/base';

/**
 * Interface for family communication quality survey history item
 */
export interface IFamilyCommunicationQualitySurveyHistory extends IBase {
  date: Date;
  result: string;
  communicationLevel: string;
  score: number;
}

/**
 * Interface for family communication quality survey question
 */
export interface IFamilyCommunicationQualitySurveyQuestion {
  id: number;
  text: string;
  options: IFamilyCommunicationQualitySurveyOption[];
}

/**
 * Interface for family communication quality survey option
 */
export interface IFamilyCommunicationQualitySurveyOption {
  id: number;
  text: string;
  selected: boolean;
  value: number;
}

/**
 * Interface for family communication quality survey detail
 */
export interface IFamilyCommunicationQualitySurveyDetail extends IBase {
  date: Date;
  questions: IFamilyCommunicationQualitySurveyQuestion[];
  result: string;
  communicationLevel: string;
  score: number;
  feedback: string;
}
