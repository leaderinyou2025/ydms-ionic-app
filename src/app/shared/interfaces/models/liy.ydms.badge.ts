import { AreaOfExpertise } from '../../enums/area-of-expertise';
import { IBase } from '../base/base';
import { BadgeCondition } from '../../enums/badge-condition';

/**
 * Model: Danh mục huy hiệu
 */
export interface ILiyYdmsBadge extends IBase {
  area_of_expertise: AreaOfExpertise;
  condition?: BadgeCondition;
  condition_value?: number;
  desciption?: string;
  active_image?: string;    // Hình ảnh khi đạt được
  review_image?: string;    // Hình ảnh khi chưa đạt
  order_weight: number;
}
