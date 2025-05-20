import { AreaOfExpertise } from "../../enums/area-of-expertise";
import {IBase} from "../base/base";

/**
 * Interface for liy.ydms.achievement model (Achievement/Badge Data)
 */
export interface ILiyYdmsAchievement extends IBase {
  area_of_expertise?: AreaOfExpertise;
  teenager_id?: {
    id: number;
    name: string;
  };
  nickname?: string | null;
  badge_id?: {
    id: number;
    name: string;
  };
  badge_image?: string;
}
