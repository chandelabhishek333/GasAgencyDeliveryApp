import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStoredPushToken, registerForPushNotificationsAsync } from '../services/notificationService';
import type { ApiDeviceInfo } from '../types';

const generateRandomId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const cache = new Map<string, string>();

/** Reads a stable per-install value from AsyncStorage, generating and persisting one on first use. */
const getOrCreatePersistedId = async (storageKey: string, prefix: string): Promise<string> => {
  const cached = cache.get(storageKey);
  if (cached) {
    return cached;
  }
  const stored = await AsyncStorage.getItem(storageKey);
  if (stored) {
    cache.set(storageKey, stored);
    return stored;
  }
  const generated = generateRandomId(prefix);
  await AsyncStorage.setItem(storageKey, generated);
  cache.set(storageKey, generated);
  return generated;
};

/**
 * In dev builds, the backend's OTP rate limiter keys off `device_id` —
 * a stable per-install id means the 2nd/3rd manual test from the same
 * device gets a 429 ("Too many codes requested"). A fresh id per
 * request sidesteps that while testing. Production builds still use
 * `getOrCreatePersistedId` — a stable id is the correct behavior there
 * (device identification, fraud detection, etc.), so this only
 * applies under `__DEV__`.
 */
const getDeviceId = async (): Promise<string> => {
  if (__DEV__) {
    return generateRandomId('device');
  }
  return getOrCreatePersistedId(STORAGE_KEYS.DEVICE_ID, Platform.OS);
};

/**
 * Resolves the real FCM (Android) / APNs (iOS) device push token.
 *
 * App.tsx registers for push notifications on launch, which persists the
 * token via notificationService — the common case here is just reading
 * that cached value. If it's missing (e.g. this runs before that
 * registration has resolved) a registration attempt is made inline; if
 * permission is denied or the native fetch fails for any reason, this
 * falls back to a stable per-install placeholder so `fcm_token` is always
 * present and non-empty and the auth request never crashes because of it.
 */
const getFcmToken = async (): Promise<string> => {
  const stored = await getStoredPushToken();
  if (stored) {
    return stored;
  }
  const registered = await registerForPushNotificationsAsync();
  if (registered) {
    return registered;
  }
  return getOrCreatePersistedId(STORAGE_KEYS.FCM_TOKEN_PLACEHOLDER, 'no-fcm');
};

/**
 * Builds the `device` object the live delivery-auth API expects on
 * OTP request/resend/verify.
 */
export const getDeviceInfo = async (): Promise<ApiDeviceInfo> => ({
  device_id: await getDeviceId(),
  device_type: Platform.OS.toUpperCase(),
  device_name: Constants.deviceName ?? 'Unknown Device',
  app_version: Constants.expoConfig?.version ?? '0.0.0',
  fcm_token: await getFcmToken(),
});
