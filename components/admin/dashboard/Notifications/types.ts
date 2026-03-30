export type NotificationType =
  | 'task_expiring'
  | 'new_interest'
  | 'new_message'
  | 'task_expired'
  | 'report_alert';

export type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
};