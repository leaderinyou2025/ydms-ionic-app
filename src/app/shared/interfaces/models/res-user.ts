import { IBase } from '../base/base';
import { RelatedField } from '../base/related-field';

export interface IResUser extends IBase {
  login: string;                  // Tên đăng nhập
  email?: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  identification_id?: string;
  lang?: string;
  street?: string;
  precint_id?: RelatedField;
  district_id?: RelatedField;
  state_id?: RelatedField;
  image?: string;
}
