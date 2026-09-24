import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { resolveMockResponse } from './mockHandlers';

const MOCK_LATENCY_MS = 400;

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Used as apiClient's axios `adapter` when USE_MOCK_DATA is on —
 * short-circuits every request with canned data instead of touching
 * the network at all. A small artificial delay keeps loading states
 * (Loader, Button's `loading` prop) visibly exercised during preview,
 * rather than resolving instantly and making them invisible.
 */
export const mockAdapter: AxiosAdapter = async (
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> => {
  await delay(MOCK_LATENCY_MS);
  const { status, data } = resolveMockResponse(config);

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[mock]', (config.method ?? 'get').toUpperCase(), config.url);
  }

  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config,
  };
};
