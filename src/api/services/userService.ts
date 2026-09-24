import { apiClient } from '../client';
import { USER_ENDPOINTS } from '../endpoints/userEndpoints';
import type { ApiSuccessResponse, Driver, Notification } from '../../types';

/** User/driver domain — profile and notifications. */
export const userService = {
  async getProfile(): Promise<Driver> {
    const response = await apiClient.get<ApiSuccessResponse<Driver>>(USER_ENDPOINTS.PROFILE);
    return response.data.data;
  },

  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<ApiSuccessResponse<Notification[]>>(
      USER_ENDPOINTS.NOTIFICATIONS,
    );
    return response.data.data;
  },

  async markNotificationRead(notificationId: string): Promise<void> {
    await apiClient.patch(USER_ENDPOINTS.NOTIFICATION_READ(notificationId));
  },
};
