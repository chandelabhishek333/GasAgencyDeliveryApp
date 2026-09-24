import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

const ANDROID_CHANNEL_ID = 'default';

// Foreground notifications still show a banner + sound, matching what the
// OS does automatically in background/killed states — without this the
// default SDK behavior is to swallow foreground notifications silently.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const ensureAndroidChannel = async (): Promise<void> => {
  if (Platform.OS !== 'android') {
    return;
  }
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Delivery updates',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#0067A5',
  });
};

/** Checks/requests OS notification permission. Never throws — resolves false on denial or error. */
export const requestNotificationPermissionsAsync = async (): Promise<boolean> => {
  try {
    const existing = await Notifications.getPermissionsAsync();
    if (existing.granted) {
      return true;
    }
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch {
    return false;
  }
};

/**
 * Tries the real native FCM (Android) / APNs (iOS) device push token first
 * — this is what a standalone/dev-client/APK build should send. Returns
 * null (never throws) if it's unavailable, so the caller can fall back to
 * `getExpoPushTokenAsync`.
 */
const getNativeDevicePushToken = async (): Promise<string | null> => {
  try {
    const { data: token } = await Notifications.getDevicePushTokenAsync();
    return token ?? null;
  } catch (error) {
    // Expected in Expo Go on Android — SDK 53+ removed remote-push support
    // there entirely (expo-notifications throws instead of just warning),
    // so this isn't a real failure, just a signal to try the Expo-hosted
    // token below.
    console.warn('[notificationService] getDevicePushTokenAsync unavailable, trying Expo push token:', error);
    return null;
  }
};

/**
 * Falls back to Expo's hosted push token when the native device token
 * isn't available (Expo Go). Still won't work on Expo Go for Android (see
 * `getNativeDevicePushToken` above — the native call it wraps throws
 * before this even reaches Expo's servers) and requires a real EAS
 * `extra.eas.projectId` in app.json (not the `REPLACE_WITH_...` placeholder)
 * to succeed on iOS Expo Go. Returns null (never throws) on any failure.
 *
 * Note for the backend: this returns an `ExponentPushToken[...]` string,
 * not a raw FCM registration token — sending it straight to Firebase
 * Admin's `send()` will fail. Delivering to it requires Expo's push API
 * (or checking the token's shape and branching) until a dev-client/APK
 * build sends a real device token instead.
 */
const getExpoHostedPushToken = async (): Promise<string | null> => {
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const { data: token } = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    return token ?? null;
  } catch (error) {
    console.warn('[notificationService] getExpoPushTokenAsync failed too:', error);
    return null;
  }
};

/**
 * Fetches a push token — real device token where available, falling back
 * to an Expo-hosted token under Expo Go — and persists it to AsyncStorage
 * under `STORAGE_KEYS.FCM_TOKEN`.
 *
 * Never throws — returns null on a simulator/emulator without push
 * support, on permission denial, or if both token fetches fail (e.g.
 * Expo Go on Android, or no EAS projectId configured yet), so callers
 * (getDeviceInfo) can fall back to a placeholder instead of blocking the
 * auth request.
 */
export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  try {
    if (!Device.isDevice) {
      return null;
    }
    const granted = await requestNotificationPermissionsAsync();
    if (!granted) {
      return null;
    }
    await ensureAndroidChannel();

    const token = (await getNativeDevicePushToken()) ?? (await getExpoHostedPushToken());
    if (!token) {
      return null;
    }
    await AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
    return token;
  } catch (error) {
    console.warn('[notificationService] Failed to register for push notifications:', error);
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

let pushTokenSubscription: Notifications.EventSubscription | null = null;
let notificationReceivedSubscription: Notifications.EventSubscription | null = null;
let notificationResponseSubscription: Notifications.EventSubscription | null = null;

export interface NotificationListenerHandlers {
  /** Fired when a push arrives while the app is in the foreground (e.g. "New Delivery Assigned"). */
  onForegroundNotification?: (notification: Notifications.Notification) => void;
  /** Fired when the user taps a notification — foreground, background, or the app was launched by it. */
  onNotificationTap?: (response: Notifications.NotificationResponse) => void;
}

/**
 * Wires the app-lifetime notification listeners: native push-token rotation
 * (FCM can reissue a token while the app is running), a push arriving in
 * the foreground, and the user tapping a notification. Background/killed
 * delivery is handled by the OS + native FCM/APNs integration automatically
 * (no JS listener needed) — `setNotificationHandler` above only governs the
 * foreground presentation.
 *
 * Call once near the app root (e.g. App.tsx) and call
 * `removeNotificationListeners` on unmount.
 */
export const addNotificationListeners = (handlers: NotificationListenerHandlers = {}): void => {
  pushTokenSubscription = Notifications.addPushTokenListener((devicePushToken) => {
    const token = devicePushToken?.data;
    if (typeof token === 'string' && token) {
      AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token).catch(() => {});
    }
  });

  notificationReceivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
    handlers.onForegroundNotification?.(notification);
  });

  notificationResponseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    handlers.onNotificationTap?.(response);
  });
};

export const removeNotificationListeners = (): void => {
  pushTokenSubscription?.remove();
  notificationReceivedSubscription?.remove();
  notificationResponseSubscription?.remove();
  pushTokenSubscription = null;
  notificationReceivedSubscription = null;
  notificationResponseSubscription = null;
};
