import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export const selectNotificationsState = (state: RootState): RootState['notifications'] =>
  state.notifications;
export const selectNotifications = (state: RootState) => state.notifications.items;
export const selectNotificationsStatus = (state: RootState) => state.notifications.status;

/** Screen 13's "Unread (2)" tab count — derived so it can never drift from `items`. */
export const selectUnreadCount = createSelector(
  selectNotifications,
  (notifications) => notifications.filter((notification) => !notification.isRead).length,
);
