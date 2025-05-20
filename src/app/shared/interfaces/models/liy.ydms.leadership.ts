import { IBase } from '../base/base';
import { IRelatedField } from '../base/related-field';
import { AreaOfExpertise } from '../../enums/area-of-expertise';

/**
 * Interface for liy.ydms.leadership model (Rank)
 */
export interface ILiyYdmsLeadership extends IBase {
  teenager_id: IRelatedField;
  area_of_expertise: AreaOfExpertise;
  parent_id: IRelatedField | null;
  rank_month: string;
  total_points: number;
  ranking: number;
  nickname?: string;
}
