export const USER_ENDPOINTS = {
  PROFILE: '/driver/profile',
  NOTIFICATIONS: '/notifications',
  // TODO: confirm endpoint — not in the original spec; needed for the
  // "mark as read" flow in src/hooks/useNotifications.ts
  NOTIFICATION_READ: (notificationId: string): string => `/notifications/${notificationId}/read`,
} as const;
