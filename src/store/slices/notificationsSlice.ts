import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userService } from '../../api/services/userService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { Notification } from '../../types';

interface NotificationsState {
  items: Notification[];
  /** Live GET /notifications/unread-count — the tab bar badge. null until loaded (badge then derives from `items`). */
  unreadCount: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: null,
  status: 'idle',
  error: null,
};

/** Screen 13 — the notifications list. */
export const fetchNotifications = createAsyncThunk<Notification[], void, { rejectValue: string }>(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getNotifications();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/** Tab bar bell badge — the server's own unread count. */
export const fetchUnreadCount = createAsyncThunk<number, void, { rejectValue: string }>(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getUnreadCount();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/** Marks a single notification read; unread count is derived, not stored, via selectors. */
export const markNotificationRead = createAsyncThunk<string, string, { rejectValue: string }>(
  'notifications/markRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await userService.markNotificationRead(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load notifications.';
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.items.find((item) => item.id === action.payload);
        if (notification && !notification.isRead && state.unreadCount) {
          state.unreadCount -= 1;
        }
        if (notification) {
          notification.isRead = true;
        }
      });
  },
});

export const notificationsReducer = notificationsSlice.reducer;
export type { NotificationsState };
