import { IBase } from '../base/base';
import { AreaOfExpertise } from '../../enums/area-of-expertise';
import { IRelatedField } from '../base/related-field';
import { GuideType } from '../../enums/guide-type';
import { TaskStatus } from '../../enums/task-status';

/**
 * Model: Nhiệm vụ
 */
export interface ILiyYdmsTask extends IBase {
  guide_id: IRelatedField;
  guide_type: GuideType;
  assignee_ids: Array<number>;
  area_of_expertise: AreaOfExpertise;
  status: TaskStatus;
  rank_point?: number;
  scores?: number;
  task_image_result?: string,
  task_percentage_result?: number,
  task_text_result?: string,
}
