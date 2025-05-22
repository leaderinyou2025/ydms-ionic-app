import { IBase } from '../base/base';
import { IRelatedField } from '../base/related-field';

/**
 * Model: Quận huyện
 */
export interface ILiyYdmsDistrict extends IBase {
  admin_code?: string;
  state_id: IRelatedField;
  district_ids?: Array<number>;
  precint_ids?: Array<number>;
  order_weight: number;
}
