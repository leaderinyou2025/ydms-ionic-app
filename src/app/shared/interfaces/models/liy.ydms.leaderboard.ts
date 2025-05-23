import { IBase } from '../base/base';
import { IRelatedField } from '../base/related-field';
import { AreaOfExpertise } from '../../enums/area-of-expertise';
import { RankMonth } from '../../enums/rank-month';

/**
 * Model: Xếp hạng
 */
export interface ILiyYdmsLeaderboard extends IBase {
  teenager_id: IRelatedField;
  area_of_expertise: AreaOfExpertise;
  parent_id?: IRelatedField;
  rank_month: RankMonth;
  total_points: number;
  ranking: number;
  nickname?: string;
}
