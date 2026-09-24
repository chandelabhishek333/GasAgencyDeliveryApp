import { Linking } from 'react-native';

/** Opens an address in the device's default maps app via Google Maps' universal search URL. */
export const openInMaps = (address: string): void => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  Linking.openURL(url).catch(() => {});
};
