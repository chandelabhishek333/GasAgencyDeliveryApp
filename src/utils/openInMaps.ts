import { Linking } from 'react-native';
import type { CustomerInfo } from '../types';

/**
 * Opens a customer's location in the device's default maps app via Google
 * Maps' universal search URL — their locked coordinates when the server has
 * them (`isLocationCaptured`), else the address text. A plain string is
 * searched as-is.
 */
export const openInMaps = (target: string | CustomerInfo): void => {
  const query =
    typeof target === 'string'
      ? target
      : target.isLocationCaptured && target.latitude != null && target.longitude != null
        ? `${target.latitude},${target.longitude}`
        : target.address;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  Linking.openURL(url).catch(() => {});
};
