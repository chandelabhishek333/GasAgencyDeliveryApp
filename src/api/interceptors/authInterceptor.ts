import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';

/** Endpoints that run before a token exists — never attach Authorization. */
const PUBLIC_ENDPOINT_PREFIXES = [
  '/api/v1/delivery/auth/otp/request',
  '/api/v1/delivery/auth/otp/resend',
  '/api/v1/delivery/auth/otp/verify',
  '/api/v1/delivery/auth/token/refresh',
];

const isPublicEndpoint = (url?: string): boolean =>
  !!url && PUBLIC_ENDPOINT_PREFIXES.some((prefix) => url.startsWith(prefix));

/**
 * Attaches the driver's Bearer access token to every request except
 * the public auth endpoints.
 */
export const attachAuthInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    if (isPublicEndpoint(config.url)) {
      return config;
    }

    const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return config;
  });
};
