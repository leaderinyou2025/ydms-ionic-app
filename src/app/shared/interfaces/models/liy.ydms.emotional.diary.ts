import { IBase } from '../base/base';
import { IRelatedField } from '../base/related-field';

/**
 * Model: Nhật ký cảm xúc
 */
export interface ILiyYdmsEmotionalDiary extends IBase {
  answer_icon?: string;
  answer_id?: IRelatedField;
  answer_text?: string;
  nickname?: string;
  question_id: IRelatedField;
  rank_point: string;
  scores: string;
  teenager_id: IRelatedField;
}
