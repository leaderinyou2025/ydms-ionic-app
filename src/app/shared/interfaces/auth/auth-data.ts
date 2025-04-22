import { IResUser } from '../models/res-user';
import { RelatedField } from '../base/related-field';
import { IUserRoles } from '../../enums/user-roles';

export interface IAuthData extends IResUser {
  nickname?: string;
  role: IUserRoles;
  password?: string;
  school_id?: RelatedField;
  classroom_id?: RelatedField;
  student_id?: RelatedField;
  teacher_id?: RelatedField;
  parent_id?: RelatedField;
  background_image?: string;
  background_sound_url?: string;
  click_button_sound_url?: string;
  check_sound_url?: string;
  uncheck_sound_url?: string;
  reload_sound_url?: string;
  correct_sound_url?: string;
  failure_sound_url?: string;
}
