import { IBase } from '../base/base';
import { IRelatedField } from '../base/related-field';

export interface IResUser extends IBase {
  login: string;                  // Tên đăng nhập
  email?: string;
  phone?: string;
  street?: string;
  precint_id?: IRelatedField;
  district_id?: IRelatedField;
  state_id?: IRelatedField;
  country_id?: IRelatedField;
  image_128?: string;
  lang?: string;
  gender?: 'male' | 'female' | 'other';
  dob?: string;     // Date of birth
}
