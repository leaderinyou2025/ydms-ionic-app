import { IRelatedField } from '../base/related-field';
import { IBase } from '../base/base';
import { NotificationTypes } from '../../enums/notification-type';

/**
 * Model: Thông báo
 */
export interface ILiyYdmsNotification extends IBase {
  description: string;
  body: string;
  sender_id: IRelatedField;
  recipient_ids: Array<number>;
  state: boolean;
  type?: NotificationTypes;
  attachment_id?: string;
  attachment_name?: string;
}
