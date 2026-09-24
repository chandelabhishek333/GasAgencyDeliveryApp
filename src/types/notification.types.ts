export type NotificationType = 'new_delivery' | 'delivery_confirmed' | 'order_updated' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  subtitle: string;
  createdAt: string;
  isRead: boolean;
}
