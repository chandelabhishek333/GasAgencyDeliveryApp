import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL, API_TIMEOUT, USE_MOCK_DATA } from '../config/apiConfig';
import { attachAuthInterceptor } from './interceptors/authInterceptor';
import { attachErrorInterceptor } from './interceptors/errorInterceptor';
import { mockAdapter } from './mocks/mockAdapter';

/**
 * Single shared Axios instance for the whole app. Screens and hooks
 * must never call axios/fetch directly — go through src/api/services/.
 *
 * When USE_MOCK_DATA is on, `adapter` swaps out axios's real HTTP
 * transport for mockAdapter, so every request short-circuits to
 * canned data (see src/api/mocks/) without touching the network.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  adapter: USE_MOCK_DATA ? mockAdapter : undefined,
});

if (__DEV__ && USE_MOCK_DATA) {
  // eslint-disable-next-line no-console
  console.log(
    '[mock] USE_MOCK_DATA is on — every API call returns canned data. ' +
      'Set EXPO_PUBLIC_USE_MOCK_DATA=false in .env once the real API is live.',
  );
}

attachAuthInterceptor(apiClient);
attachErrorInterceptor(apiClient);

export default apiClient;
