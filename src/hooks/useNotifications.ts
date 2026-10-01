import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../store/slices/notificationsSlice';
import {
  selectNotifications,
  selectNotificationsStatus,
  selectUnreadCount,
} from '../store/selectors/notificationsSelectors';

/**
 * Fetches notifications on mount and exposes the list, unread count,
 * mark-read and mark-all-read. Shared by Home (bell badge) and NotificationsScreen
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

  // Reloads the list and the server's unread count (the tab bar badge).
  const reload = useCallback(() => [dispatch(fetchNotifications()), dispatch(fetchUnreadCount())], [dispatch]);

  return {
    reload,
    notifications,
    status,
    unreadCount,
    isLoading: status === 'loading' && notifications.length === 0,
    markRead: (notificationId: string) => dispatch(markNotificationRead(notificationId)),
    /** POST /notifications/read-all; resolves to the thunk's result so callers can unwrap() failures. */
    markAllRead: () => dispatch(markAllNotificationsRead()),
  };
};
