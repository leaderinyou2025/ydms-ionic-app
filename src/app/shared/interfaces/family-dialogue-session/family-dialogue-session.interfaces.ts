import { IBase } from '../base/base';

/**
 * Interface for family dialogue session history item
 */
export interface IFamilyDialogueSessionHistory extends IBase {
  date: Date;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'in_progress';
}

/**
 * Interface for family dialogue session question
 */
export interface IFamilyDialogueSessionQuestion {
  id: number;
  text: string;
  type: 'suggested' | 'parent'; // suggested questions or questions from parents
  answer?: string; // The student's answer to this question
}

/**
 * Interface for family dialogue session detail
 */
export interface IFamilyDialogueSessionDetail extends IBase {
  date: Date;
  title: string;
  description: string;
  questions: IFamilyDialogueSessionQuestion[];
  status: 'completed' | 'pending' | 'in_progress';
  feedback?: string;
}
