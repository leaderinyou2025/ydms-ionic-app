import { IResUser } from '../models/res.user';
import { RelatedField } from '../base/related-field';
import { UserRoles } from '../../enums/user-roles';
import { IUserSettings } from '../settings/user-settings';

export interface IAuthData extends IResUser {
  nickname?: string;
  avatar?: RelatedField;
  avatar_128?: string;
  code?: string;
  edu_id?: string;
  social_id?: string;
  user_settings?: IUserSettings;

  // User roles
  is_teenager: boolean;
  is_parent: boolean;
  is_teacher: boolean;

  // Related fields
  school_id?: RelatedField;
  classroom_id?: RelatedField;
  parent_id?: RelatedField;
  partner_id?: RelatedField;
  classroom_ids?: Array<number>;
  child_ids?: Array<number>;
}
