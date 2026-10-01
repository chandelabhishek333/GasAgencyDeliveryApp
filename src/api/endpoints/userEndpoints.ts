import { DELIVERY_API_PREFIX } from './basePath';

/** Paths match the live OpenAPI spec (/api/v1/delivery/driver/* and /notifications). */
export const USER_ENDPOINTS = {
  /** GET — driver info + today's shiftStats; also the only source of the current `onDuty`. */
  PROFILE: `${DELIVERY_API_PREFIX}/driver/profile`,
  /** PATCH { onDuty } -> { onDuty } — the Home duty toggle. There is no GET. */
  DRIVER_STATUS: `${DELIVERY_API_PREFIX}/driver/status`,
  INVENTORY: `${DELIVERY_API_PREFIX}/driver/inventory`,
  NOTIFICATIONS: `${DELIVERY_API_PREFIX}/notifications`,
  UNREAD_COUNT: `${DELIVERY_API_PREFIX}/notifications/unread-count`,
  NOTIFICATION_READ: (notificationId: string): string =>
    `${DELIVERY_API_PREFIX}/notifications/${notificationId}/read`,
  /** POST — marks every notification read. */
  NOTIFICATIONS_READ_ALL: `${DELIVERY_API_PREFIX}/notifications/read-all`,
} as const;
