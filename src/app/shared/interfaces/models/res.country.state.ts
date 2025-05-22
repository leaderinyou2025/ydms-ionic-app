import { IBase } from '../base/base';
import { IRelatedField } from '../base/related-field';

/**
 * Model: Tỉnh thành
 */
export interface IResCountryState extends IBase {
  code: string;
  admin_code?: string;
  country_id: IRelatedField;
  precint_ids?: Array<number>;
  order_weight: number;
}
