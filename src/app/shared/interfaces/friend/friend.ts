import { IBase } from '../base/base';

export interface IFriend extends IBase {
  avatar?: string;
  likeCount?: number;
  rank?: number;
  achievements?: number;
  friendshipLevel?: number;
}
