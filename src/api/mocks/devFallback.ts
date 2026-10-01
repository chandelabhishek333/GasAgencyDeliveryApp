import type { InternalAxiosRequestConfig } from 'axios';
import { resolveMockResponse } from './mockHandlers';

type MockMethod = 'get' | 'post' | 'put' | 'patch';

interface MockRequest {
  method: MockMethod;
  url: string;
  /** Request body — the stateful mocks (confirm, update-items, …) read it. */
  data?: unknown;
}

const isEmptyResult = (value: unknown): boolean =>
  value == null ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'object' && Array.isArray((value as { items?: unknown }).items) &&
    (value as { items: unknown[] }).items.length === 0);

/**
 * Dev-only safety net: if `send` fails (404, 5xx, anything), its body
 * doesn't map, or it maps to an empty list, the route's mock body is run
 * through the same `map` instead — so the orders list and the whole
 * delivery flow stay testable on a device while the test driver has no
 * live deliveries. Mocks use the live wire shapes (see mockHandlers), so
 * one mapper serves both. Production builds (and any route without a
 * mock) keep the real result / error untouched.
 */
export const withDevMockFallback = async <T>(
  request: MockRequest,
  send: () => Promise<unknown>,
  map: (body: unknown) => T,
): Promise<T> => {
  if (!__DEV__) {
    return map(await send());
  }

  let result: T | undefined;
  let failure: unknown;
  try {
    result = map(await send());
    if (!isEmptyResult(result)) {
      return result;
    }
  } catch (error) {
    failure = error;
  }

  let mock: T;
  try {
    const { data } = resolveMockResponse({
      method: request.method,
      url: request.url,
      data: request.data,
    } as InternalAxiosRequestConfig);
    mock = map(data);
  } catch {
    if (failure) {
      throw failure;
    }
    return result as T;
  }
  // eslint-disable-next-line no-console
  console.warn(
    `[mock] ${request.method.toUpperCase()} ${request.url} ${failure ? 'failed' : 'returned no data'} — using mock data (dev only)`,
  );
  return mock;
};
