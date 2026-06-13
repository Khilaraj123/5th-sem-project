export type NotificationChannel = 'email' | 'push' | 'in-app';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  channel: NotificationChannel;
  isRead: boolean;
  createdAt: string;
}

export interface SendEmailInput {
  email: string;
  subject: string;
  message: string;
}

export interface SendPushInput {
  userId: string;
  title: string;
  message: string;
}

export interface SendInAppInput {
  userId: string;
  title: string;
  message: string;
}
