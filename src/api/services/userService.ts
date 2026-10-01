import { apiClient } from '../client';
import { USER_ENDPOINTS } from '../endpoints/userEndpoints';
import { toDriver, unwrapResponse } from '../mappers/deliveryMappers';
import type { DriverInventory } from '../mappers/deliveryMappers';
import type { ApiSuccessResponse, Driver, Notification, NotificationType } from '../../types';

/**
 * One notification as the live API sends it (GET /api/v1/delivery/notifications
 * returns a bare array of these — no {success,data} envelope).
 */
interface ApiNotification {
  id: string;
  title: string;
  message: string;
  category: string;
  createdAt: string;
  read: boolean;
}

// The live API only has a coarse category; the app's icon types map from it.
const TYPE_BY_CATEGORY: Record<string, NotificationType> = {
  DELIVERY: 'new_delivery',
  ORDER: 'order_updated',
};

/** Live notifications are mapped to the app's shape; mock ones (already app-shaped) pass through. */
const toNotification = (item: ApiNotification | Notification): Notification =>
  'isRead' in item
    ? item
    : {
        id: item.id,
        type: TYPE_BY_CATEGORY[item.category] ?? 'system',
        title: item.title,
        subtitle: item.message,
        createdAt: item.createdAt,
        isRead: item.read,
      };

/** User/driver domain — profile, duty status, van inventory and notifications. */
export const userService = {
  /** GET /driver/profile — also the only live source of the current duty state (`onDuty`). */
  async getProfile(): Promise<Driver> {
    const response = await apiClient.get(USER_ENDPOINTS.PROFILE);
    return toDriver(response.data);
  },

  /** PATCH /driver/status — go on/off duty; the server answers with the updated profile. */
  async updateDutyStatus(onDuty: boolean): Promise<Driver> {
    const response = await apiClient.patch(USER_ENDPOINTS.DRIVER_STATUS, { onDuty });
    return toDriver(response.data);
  },

  /** GET /driver/inventory — full/empty cylinders currently on the van. */
  async getInventory(): Promise<DriverInventory> {
    const response = await apiClient.get(USER_ENDPOINTS.INVENTORY);
    const data = unwrapResponse<DriverInventory>(response.data);
    return {
      fullCylinderCount: data.fullCylinderCount,
      emptyCylinderCount: data.emptyCylinderCount,
      activeDeliveries: data.activeDeliveries,
    };
  },

  /** GET /notifications/unread-count — drives the tab bar bell badge. */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get(USER_ENDPOINTS.UNREAD_COUNT);
    return unwrapResponse<{ unread: number }>(response.data).unread ?? 0;
  },

  // Accepts both the live bare array and the mocks' {success,data}
  // envelope, and never returns undefined — the tab bar's unread badge
  // reads this list on every signed-in screen.
  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<ApiNotification[] | ApiSuccessResponse<Notification[]>>(
      USER_ENDPOINTS.NOTIFICATIONS,
    );
    const body = response.data;
    const list = Array.isArray(body) ? body : body?.data ?? [];
    return list.map(toNotification);
  },

  async markNotificationRead(notificationId: string): Promise<void> {
    await apiClient.patch(USER_ENDPOINTS.NOTIFICATION_READ(notificationId));
  },
};
