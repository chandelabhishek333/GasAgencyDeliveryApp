import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchNotifications, markNotificationRead } from '../store/slices/notificationsSlice';
import {
  selectNotifications,
  selectNotificationsStatus,
  selectUnreadCount,
} from '../store/selectors/notificationsSelectors';

/**
 * Fetches notifications on mount and exposes the list, unread count,
 * and mark-read. Shared by Home (bell badge) and NotificationsScreen
 * (full list) so neither duplicates the fetch.
 */
export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const status = useAppSelector(selectNotificationsStatus);
  const unreadCount = useAppSelector(selectUnreadCount);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return {
    notifications,
    status,
    unreadCount,
    isLoading: status === 'loading' && notifications.length === 0,
    markRead: (notificationId: string) => dispatch(markNotificationRead(notificationId)),
  };
};
