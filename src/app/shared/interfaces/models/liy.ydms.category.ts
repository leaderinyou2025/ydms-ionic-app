import { IBase } from '../base/base';
import { AreaOfExpertise } from '../../enums/area-of-expertise';

/**
 * Model: Chủ đề chuyên môn
 */
export interface ILiyYdmsCategory extends IBase {
  area_of_expertise: AreaOfExpertise;
  tags?: string;
  desciption?: string;
  image_128?: string;
}
