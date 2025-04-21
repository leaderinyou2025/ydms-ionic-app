import { IResUser } from '../models/res-user';

export interface IAuthData extends IResUser {
  email?: string;
  phone?: string;
  password?: string;
}
