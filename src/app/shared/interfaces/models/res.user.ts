import { IBase } from '../base/base';
import { RelatedField } from '../base/related-field';

export interface IResUser extends IBase {
  login: string;                  // Tên đăng nhập
  email?: string;
  phone?: string;
  street?: string;
  precint_id?: RelatedField;
  district_id?: RelatedField;
  state_id?: RelatedField;
  country_id?: RelatedField;
  image_128?: string;
  lang?: string;
}
