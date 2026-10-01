import { useCallback } from 'react';
import { useHasLoadedOnce } from './useHasLoadedOnce';
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
 * The notifications list, unread count, `reload` (list + server unread
 * count), mark-read and mark-all-read. Doesn't fetch by itself — the
 * screen calls `reload` on focus; the tab bar keeps the badge fresh on its own.
 */
export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const status = useAppSelector(selectNotificationsStatus);
  const unreadCount = useAppSelector(selectUnreadCount);

  const hasLoadedOnce = useHasLoadedOnce(status);

  // Reloads the list and the server's unread count (the tab bar badge).
  const reload = useCallback(() => [dispatch(fetchNotifications()), dispatch(fetchUnreadCount())], [dispatch]);

  return {
    reload,
    notifications,
    status,
    unreadCount,
    // Full-screen loader on the very first load only; focus re-fetches refresh in place.
    isLoading: !hasLoadedOnce && notifications.length === 0,
    markRead: (notificationId: string) => dispatch(markNotificationRead(notificationId)),
    /** POST /notifications/read-all; resolves to the thunk's result so callers can unwrap() failures. */
    markAllRead: () => dispatch(markAllNotificationsRead()),
  };
};
