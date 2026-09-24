import { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import type { Notification } from '../../types';

type NotificationsTab = 'all' | 'unread';

export const useNotificationsScreen = () => {
  const { notifications, isLoading, unreadCount, markRead } = useNotifications();
  const [tab, setTab] = useState<NotificationsTab>('all');

  const filtered = tab === 'unread' ? notifications.filter((item) => !item.isRead) : notifications;

  const handleNotificationPress = (notification: Notification): void => {
    if (!notification.isRead) {
      markRead(notification.id);
    }
    // TODO: route to the relevant order/delivery once notification
    // payloads carry a linked orderId.
  };

  return {
    tab,
    setTab,
    notifications: filtered,
    unreadCount,
    isLoading,
    handleNotificationPress,
  };
};
