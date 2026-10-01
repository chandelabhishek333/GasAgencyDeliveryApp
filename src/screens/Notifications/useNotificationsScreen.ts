import { useState } from 'react';
import { Alert } from 'react-native';
import { useNotifications } from '../../hooks/useNotifications';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import type { Notification } from '../../types';

type NotificationsTab = 'all' | 'unread';

export const useNotificationsScreen = () => {
  const { notifications, isLoading, unreadCount, markRead, markAllRead, reload } = useNotifications();
  const { refreshing, handleRefresh } = usePullToRefresh(reload);
  const [tab, setTab] = useState<NotificationsTab>('all');
  const [isMarkingAllRead, setMarkingAllRead] = useState(false);

  const filtered = tab === 'unread' ? notifications.filter((item) => !item.isRead) : notifications;

  const handleNotificationPress = (notification: Notification): void => {
    if (!notification.isRead) {
      markRead(notification.id);
    }
    // TODO: route to the relevant order/delivery once notification
    // payloads carry a linked orderId.
  };

  const handleMarkAllRead = async (): Promise<void> => {
    if (isMarkingAllRead || unreadCount === 0) {
      return;
    }
    setMarkingAllRead(true);
    try {
      await markAllRead().unwrap();
    } catch (error) {
      Alert.alert('Could not mark all as read', typeof error === 'string' ? error : 'Please try again.');
    } finally {
      setMarkingAllRead(false);
    }
  };

  return {
    refreshing,
    handleRefresh,
    tab,
    setTab,
    notifications: filtered,
    unreadCount,
    isLoading,
    handleNotificationPress,
    /** Only offered while something is unread. */
    canMarkAllRead: unreadCount > 0 && !isMarkingAllRead,
    handleMarkAllRead,
  };
};
