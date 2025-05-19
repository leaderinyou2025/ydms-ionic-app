import { NotificationTypes } from '../../enums/notification-type';

export interface SearchNotificationParams {
  name?: string;
  state?: boolean;
  start_date?: string;
  end_date?: string;
  type?: NotificationTypes;
}
