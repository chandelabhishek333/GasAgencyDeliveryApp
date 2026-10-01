import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getFcmTokenAsync, getStoredPushToken } from '../services/notificationService';
import type { ApiDeviceInfo } from '../types';
const { version: APP_VERSION } = require('../../package.json') as { version: string };

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
 * Resolves the real FCM registration token (Android only for now — see
 * notificationService.ts), independent of notification permission.
 *
 * Asks Firebase directly each time so a rotated token is always picked up.
 * If that native call fails, the last real token persisted by
 * notificationService (on launch or via onTokenRefresh) is used instead.
 * There is no placeholder: if neither exists this throws, and the auth
 * request fails with that error rather than sending a fake token.
 */
const getFcmToken = async (): Promise<string> => {
  try {
    return await getFcmTokenAsync();
  } catch (error) {
    const stored = await getStoredPushToken();
    if (stored) {
      return stored;
    }
    throw new Error(`Unable to get FCM token: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Builds the `device` object the live delivery-auth API expects on
 * OTP request/resend/verify.
 */
export const getDeviceInfo = async (): Promise<ApiDeviceInfo> => ({
  device_id: await getDeviceId(),
  device_type: Platform.OS.toUpperCase(),
  device_name: Platform.OS === 'android' ? Platform.constants?.Model ?? 'Unknown Device' : 'Unknown Device',
  app_version: APP_VERSION ?? '0.0.0',
  fcm_token: await getFcmToken(),
});
