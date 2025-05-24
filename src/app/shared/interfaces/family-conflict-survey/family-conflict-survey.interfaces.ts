import { IBase } from '../base/base';
import { ILiyYdmsAssessment } from '../models/liy.ydms.assessment';
import { ILiyYdmsAssessmentQuestion } from '../models/liy.ydms.assessment.question';
import { ILiyYdmsAssessmentAnswerOption } from '../models/liy.ydms.assessment.answer.option';
import { ILiyYdmsAssessmentAnswerResult } from '../models/liy.ydms.assessment.answer.result';
import { AnswerType } from '../../enums/answer-type';

/**
 * Interface for family conflict survey history item
 */
export interface IFamilyConflictSurveyHistory extends Partial<ILiyYdmsAssessment> {
}

/**
 * Interface for family conflict survey question
 */
export interface IFamilyConflictSurveyQuestion extends Partial<ILiyYdmsAssessmentQuestion> {
  id: number;
  text?: string;
  answer_type: AnswerType;
  options: IFamilyConflictSurveyOption[];
  answer_text?: string; // For INPUT_TEXT type questions
}

/**
 * Interface for family conflict survey option
 */
export interface IFamilyConflictSurveyOption extends Partial<ILiyYdmsAssessmentAnswerOption> {
  id: number;
  text?: string;
  selected: boolean;
  value?: number;
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
  // Additional properties from assessment models
  assessment?: ILiyYdmsAssessment;
  answerResults?: ILiyYdmsAssessmentAnswerResult[];
}
