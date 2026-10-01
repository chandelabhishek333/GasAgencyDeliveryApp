import type { InternalAxiosRequestConfig } from 'axios';
import { resolveMockResponse } from './mockHandlers';

/**
 * Canned data for one route, unwrapped from mockHandlers' `{success,data}`
 * envelope — the same data USE_MOCK_DATA mode would serve for it.
 * Throws if mockHandlers has no handler for the route.
 */
const mockDataFor = <T>(method: string, url: string): T => {
  const { data } = resolveMockResponse({ method, url } as InternalAxiosRequestConfig);
  return (data as { data: T }).data;
};

const isEmptyResult = (value: unknown): boolean =>
  value == null ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'object' && Array.isArray((value as { items?: unknown }).items) &&
    (value as { items: unknown[] }).items.length === 0);

/**
 * Dev-only safety net while the real order/delivery endpoints aren't
 * live: if `request` fails (404, 5xx, anything) or resolves empty, serve
 * the mock for `method url` instead, so the orders list and the whole
 * delivery flow stay testable on a device. Production builds (and any
 * route without a mock) keep the real result / error untouched.
 */
export const withDevMockFallback = async <T>(
  method: 'get' | 'post',
  url: string,
  request: () => Promise<T>,
): Promise<T> => {
  if (!__DEV__) {
    return request();
  }

  let result: T | undefined;
  let failure: unknown;
  try {
    result = await request();
    if (!isEmptyResult(result)) {
      return result;
    }
  } catch (error) {
    failure = error;
  }

  try {
    const mock = mockDataFor<T>(method, url);
    // eslint-disable-next-line no-console
    // "no usable data" also covers a 200 whose shape the service doesn't
    // parse yet (e.g. the live API's bare arrays vs the {success,data}
    // envelope the services still expect).
    console.warn(
      `[mock] ${method.toUpperCase()} ${url} ${failure ? 'failed' : 'returned no usable data'} — using mock data (dev only)`,
    );
    return mock;
  } catch {
    if (failure) {
      throw failure;
    }
    return result as T;
  }
};
