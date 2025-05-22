import { IBase } from '../base/base';

/**
 * Model: Câu hỏi cảm xúc
 */
export interface ILiyYdmsEmotionalQuestion extends IBase {
  answer_ids?: Array<number>;
  encourage_interaction?: string;
  rank_point?: number;
}
