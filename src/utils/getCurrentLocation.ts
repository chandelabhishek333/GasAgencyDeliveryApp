import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import type { DeliveryStartRequest } from '../types';

/**
 * Fixed near-Sector-61-Noida coordinate (matches the mock delivery
 * addresses) used whenever the device denies/lacks location access, so
 * Screen 7's "I'm at the Location" step never blocks on GPS.
 */
const FALLBACK_COORDINATES: DeliveryStartRequest = { latitude: 28.5921, longitude: 77.386 };

/**
 * Unlike Expo's `Location.requestForegroundPermissionsAsync`, bare RN has
 * no built-in permission prompt on Android — it has to be requested via
 * `PermissionsAndroid` explicitly (the manifest entry alone only makes the
 * permission requestable, it doesn't prompt). iOS prompts automatically
 * from the `NSLocationWhenInUseUsageDescription` Info.plist entry, so
 * there's nothing to request there.
 */
const hasLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }
  try {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
};

/** Best-effort device GPS fix for the active-delivery location-verify step; never throws. */
export const getCurrentLocation = async (): Promise<DeliveryStartRequest> => {
  try {
    const granted = await hasLocationPermission();
    if (!granted) {
      return FALLBACK_COORDINATES;
    }
    return await new Promise<DeliveryStartRequest>((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
        () => resolve(FALLBACK_COORDINATES),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 10000 },
      );
    });
  } catch {
    return FALLBACK_COORDINATES;
  }
};
