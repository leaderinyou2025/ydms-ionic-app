import { IBase } from '../base/base';
import { AreaOfExpertise } from '../../enums/area-of-expertise';
import { IRelatedField } from '../base/related-field';

/**
 * Model: Thành tích
 */
export interface ILiyYdmsAchievement extends IBase {
  area_of_expertise?: AreaOfExpertise;
  teenager_id: IRelatedField;
  nickname?: string;
  badge_id?: IRelatedField;
  badge_image?: string;
}
