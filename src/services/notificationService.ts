import { PermissionsAndroid, Platform } from 'react-native';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  requestPermission,
  type RemoteMessage,
} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

// v26's modular API operates on an explicit Messaging instance rather than
// a namespaced messaging() singleton call — this app only ever talks to
// the default Firebase app (the one google-services.json configures), so
// one shared instance is enough.
const messagingInstance = getMessaging();

/**
 * Android 13+ requires the POST_NOTIFICATIONS runtime permission on top of
 * `requestPermission()` (which alone is enough on iOS/older Android) —
 * request it first so the Firebase prompt isn't silently a no-op on a
 * fresh Android 13+ install.
 */
const requestAndroidNotificationPermission = async (): Promise<void> => {
  if (Platform.OS !== 'android' || Platform.Version < 33) {
    return;
  }
  try {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  } catch {
    // Falls through to requestPermission()'s own status check below.
  }
};

/** Requests OS notification permission. Never throws — resolves false on denial or error. */
export const requestNotificationPermissionsAsync = async (): Promise<boolean> => {
  try {
    await requestAndroidNotificationPermission();
    const status = await requestPermission(messagingInstance);
    return status === AuthorizationStatus.AUTHORIZED || status === AuthorizationStatus.PROVISIONAL;
  } catch {
    return false;
  }
};

/**
 * Fetches the real native FCM registration token and persists it to
 * AsyncStorage under `STORAGE_KEYS.FCM_TOKEN`.
 *
 * On Android the token is issued by Play Services independently of the
 * POST_NOTIFICATIONS / display permission, so this deliberately does not
 * wait on (or require) the permission prompt. Firebase caches the token
 * natively, so repeat calls are cheap and always return the current one.
 *
 * Throws if the native fetch fails (e.g. Play Services unavailable).
 */
export const getFcmTokenAsync = async (): Promise<string> => {
  const token = await getToken(messagingInstance);
  if (!token) {
    throw new Error('Firebase returned an empty FCM token');
  }
  await AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
  return token;
};

/**
 * App-launch registration: fetches + persists the FCM token, and
 * separately asks for notification display permission. The two are
 * independent — a denied or pending permission never blocks the token.
 *
 * Never throws — returns null if the native token fetch fails.
 */
export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  requestNotificationPermissionsAsync().catch(() => {});
  try {
    return await getFcmTokenAsync();
  } catch (error) {
    console.warn('[notificationService] Failed to fetch FCM token:', error);
    return null;
  }
};

/** Reads the last persisted device push token without prompting for permission or hitting the native module. */
export const getStoredPushToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
  } catch {
    return null;
  }
};

type Unsubscribe = () => void;

let tokenRefreshUnsubscribe: Unsubscribe | null = null;
let onMessageUnsubscribe: Unsubscribe | null = null;
let onNotificationOpenedUnsubscribe: Unsubscribe | null = null;

export interface NotificationListenerHandlers {
  /** Fired after a rotated FCM token has been persisted — the server still holds the old one until it's told. */
  onTokenRefresh?: (token: string) => void;
  /** Fired when a push arrives while the app is in the foreground (e.g. "New Delivery Assigned"). */
  onForegroundNotification?: (message: RemoteMessage) => void;
  /** Fired when the user taps a notification that opened the app from a background state. */
  onNotificationTap?: (message: RemoteMessage) => void;
}

/**
 * Wires the app-lifetime notification listeners: FCM token rotation
 * (`onTokenRefresh`), a push arriving in the foreground (`onMessage`), and
 * the user tapping a notification that brought the app back from the
 * background (`onNotificationOpenedApp`). Killed-app delivery is handled
 * natively by FCM + `setBackgroundMessageHandler()`, which must be
 * registered in index.js at the top level, not here — it has to run even
 * when nothing in this module has mounted yet.
 *
 * Call once near the app root (e.g. RootNavigator) and call
 * `removeNotificationListeners` on unmount.
 */
export const addNotificationListeners = (handlers: NotificationListenerHandlers = {}): void => {
  tokenRefreshUnsubscribe = onTokenRefresh(messagingInstance, (token) => {
    AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token)
      .catch(() => {})
      .then(() => handlers.onTokenRefresh?.(token));
  });

  onMessageUnsubscribe = onMessage(messagingInstance, async (message) => {
    handlers.onForegroundNotification?.(message);
  });

  onNotificationOpenedUnsubscribe = onNotificationOpenedApp(messagingInstance, (message) => {
    handlers.onNotificationTap?.(message);
  });
};

export const removeNotificationListeners = (): void => {
  tokenRefreshUnsubscribe?.();
  onMessageUnsubscribe?.();
  onNotificationOpenedUnsubscribe?.();
  tokenRefreshUnsubscribe = null;
  onMessageUnsubscribe = null;
  onNotificationOpenedUnsubscribe = null;
};
