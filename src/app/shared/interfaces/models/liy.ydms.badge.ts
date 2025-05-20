import { AreaOfExpertise } from "../../enums/area-of-expertise";
import {IBase} from "../base/base";

/**
 * Interface for liy.ydms.badge model (Achievement Category)
 */
export interface ILiyYdmsBadge extends IBase {
  title?: string;
  active_image?: string;
  area_of_expertise?: AreaOfExpertise;
  condition?: string;
  condition_value?: number;
  order_weight?: number;
  review_image?: string;
}
