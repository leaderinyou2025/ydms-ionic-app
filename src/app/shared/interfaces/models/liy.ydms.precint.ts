import { IRelatedField } from '../base/related-field';
import { IBase } from '../base/base';

export interface ILiyYdmsPrecint extends IBase {
  admin_code?: string;
  state_id: IRelatedField;
  district_id: IRelatedField;
  order_weight: number;
}
