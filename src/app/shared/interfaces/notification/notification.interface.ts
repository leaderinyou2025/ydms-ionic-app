export enum NotificationType {
  EMOTION_SHARED = 'emotion_shared',
  PERSONAL_TASK = 'personal_task',
  OTHER = 'other'
}

export interface INotification {
  id: number;
  sender: {
    id: number;
    name: string;
    avatar?: string;
  };
  message: string;
  timestamp: string; // ISO string format
  isRead: boolean;
  type: NotificationType; // Type of notification
  title?: string; // Optional title for the notification
}
