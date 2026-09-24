/** AsyncStorage keys used by the auth interceptors and useAuth hook. */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@mbga/access_token',
  REFRESH_TOKEN: '@mbga/refresh_token',
  /** Stable per-install identifier sent as `device.device_id` on OTP request/verify. */
  DEVICE_ID: '@mbga/device_id',
  /** Real native FCM (Android) / APNs (iOS) device push token, persisted by notificationService. */
  FCM_TOKEN: '@mbga/fcm_token',
  /** Fallback sent as `device.fcm_token` when permission is denied or the real token can't be fetched. */
  FCM_TOKEN_PLACEHOLDER: '@mbga/fcm_token_placeholder',
} as const;
