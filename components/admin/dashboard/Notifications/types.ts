export type NotificationType =
  | "user_joined"
  | "task_created"
  | "task_reported"
  | "user_reported"
  | "system";

export type Notification = {
  id: string;
  type: NotificationType | string;
  title: string;
  description: string;
  time: string;
  read: boolean;
};