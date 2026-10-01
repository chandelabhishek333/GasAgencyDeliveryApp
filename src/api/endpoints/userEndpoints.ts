import { DELIVERY_API_PREFIX } from './basePath';

/** Paths match the live OpenAPI spec (/api/v1/delivery/driver/* and /notifications). */
export const USER_ENDPOINTS = {
  PROFILE: `${DELIVERY_API_PREFIX}/driver/profile`,
  /** PATCH { onDuty } — the Home duty toggle. There is no GET; read `onDuty` from PROFILE. */
  DRIVER_STATUS: `${DELIVERY_API_PREFIX}/driver/status`,
  INVENTORY: `${DELIVERY_API_PREFIX}/driver/inventory`,
  NOTIFICATIONS: `${DELIVERY_API_PREFIX}/notifications`,
  UNREAD_COUNT: `${DELIVERY_API_PREFIX}/notifications/unread-count`,
  NOTIFICATION_READ: (notificationId: string): string =>
    `${DELIVERY_API_PREFIX}/notifications/${notificationId}/read`,
} as const;
