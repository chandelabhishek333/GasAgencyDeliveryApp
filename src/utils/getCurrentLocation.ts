import * as Location from 'expo-location';
import type { DeliveryStartRequest } from '../types';

/**
 * Fixed near-Sector-61-Noida coordinate (matches the mock delivery
 * addresses) used whenever the device denies/lacks location access, so
 * Screen 7's "I'm at the Location" step never blocks on GPS.
 */
const FALLBACK_COORDINATES: DeliveryStartRequest = { latitude: 28.5921, longitude: 77.386 };

/** Best-effort device GPS fix for the active-delivery location-verify step; never throws. */
export const getCurrentLocation = async (): Promise<DeliveryStartRequest> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return FALLBACK_COORDINATES;
    }
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { latitude: position.coords.latitude, longitude: position.coords.longitude };
  } catch {
    return FALLBACK_COORDINATES;
  }
};
