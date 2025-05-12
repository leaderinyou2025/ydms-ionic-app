import { IResUser } from '../models/res-user';
import { RelatedField } from '../base/related-field';
import { UserRoles } from '../../enums/user-roles';
import { IUserSettings } from '../settings/user-settings';

export interface IAuthData extends IResUser {
  nickname?: string;
  role: UserRoles;
  school_id?: RelatedField;
  classroom_id?: RelatedField;
  student_id?: RelatedField;
  teacher_id?: RelatedField;
  parent_id?: RelatedField;
  user_settings?: IUserSettings;
  avatar?: string;
}
