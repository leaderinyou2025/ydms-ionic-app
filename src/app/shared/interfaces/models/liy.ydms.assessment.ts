import { IBase } from '../base/base';
import { AreaOfExpertise } from '../../enums/area-of-expertise';
import { AssessmentType } from '../../enums/assessment-type';
import { SubjectOptions } from '../../enums/subject-options';

/**
 * Model: Bảng hỏi
 */
export interface ILiyYdmsAssessment extends IBase {
  active: boolean;
  area_of_expertise: AreaOfExpertise;
  assessment_type: AssessmentType;
  description?: string;
  execution_date?: string;
  question_ids: Array<number>;
  rank_point: number;
  subject: SubjectOptions;
}
