/** AsyncStorage keys used by the auth interceptors and useAuth hook. */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@mbga/access_token',
  REFRESH_TOKEN: '@mbga/refresh_token',
  /** Stable per-install identifier sent as `device.device_id` on OTP request/verify. */
  DEVICE_ID: '@mbga/device_id',
  /** Real native FCM (Android) / APNs (iOS) device push token, persisted by notificationService. */
  FCM_TOKEN: '@mbga/fcm_token',
  /** The FCM token the server last received (OTP verify or /token/refresh) — compared against FCM_TOKEN to detect a rotation the server hasn't seen. */
  FCM_TOKEN_SYNCED: '@mbga/fcm_token_synced',
} as const;
