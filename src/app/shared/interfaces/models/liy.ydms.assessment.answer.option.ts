import { IBase } from '../base/base';
import { IRelatedField } from '../base/related-field';

/**
 * Model: Bảng hỏi - Các phương án trả lời câu hỏi
 */
export interface ILiyYdmsAssessmentAnswerOption extends IBase {
  question_id: IRelatedField;
  encourage?: string;
  guide_category_ids: IRelatedField;
  image_128?: string;
  order_weight: number;
  scores: number;
}
