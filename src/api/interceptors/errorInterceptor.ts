import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, USE_MOCK_DATA } from '../../config/apiConfig';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { AUTH_ENDPOINTS } from '../endpoints/authEndpoints';
import { resolveMockResponse } from '../mocks/mockHandlers';
import { getDeviceInfo } from '../../utils/getDeviceInfo';
import type { ApiErrorResponse, RefreshTokenApiRequest, RefreshTokenApiResponse } from '../../types';
import { ApiError } from '../../types';

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/**
 * The live API's error shapes (confirmed via Swagger for the auth
 * endpoints' 404/403/422/429 responses) — distinct from the app's own
 * `ApiErrorResponse` envelope, and not even consistent with itself:
 * `detail` can be a plain string, FastAPI's classic validation array
 * (`[{loc,msg,type}]`), or a backend-defined object
 * (`{code,message,fields}`) whose own `fields` entries can in turn be
 * either strings or `{message}` objects.
 */
interface BackendDetailField {
  message?: string;
  [key: string]: unknown;
}

interface BackendDetailObject {
  code?: string;
  message?: string;
  fields?: Array<string | BackendDetailField>;
  [key: string]: unknown;
}

interface FastApiValidationItem {
  loc?: unknown[];
  msg?: string;
  type?: string;
}

interface DetailErrorResponse {
  detail?: string | BackendDetailObject | FastApiValidationItem[];
}

type KnownErrorResponse = ApiErrorResponse | DetailErrorResponse;

let refreshPromise: Promise<string | null> | null = null;

const clearSession = async (): Promise<void> => {
  await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
};

/**
 * Clears the stored token pair AND resets the Redux auth session, so
 * RootNavigator (gated on `isAuthenticated`) swaps back to AuthStack on
 * its own — the same reactive path a normal logoutUser dispatch takes.
 * `store`/`authSlice` are required lazily (not at module top, and not
 * via a static `import` — this project's TS target doesn't support
 * dynamic `import()`) to avoid a circular import: store -> authSlice ->
 * authService -> apiClient -> this file.
 */
const forceLogoutSession = async (): Promise<void> => {
  await clearSession();
  const { store } = require('../../store') as typeof import('../../store');
  const { forceLogout } = require('../../store/slices/authSlice') as typeof import('../../store/slices/authSlice');
  store.dispatch(forceLogout());
};

/**
 * Calls /token/refresh with a bare axios call (never the intercepted
 * apiClient, to avoid recursing) and persists the new token pair.
 * Concurrent 401s share a single in-flight refresh via `refreshPromise`,
 * so only one refresh call ever runs — every other caller awaits this
 * same promise and retries its own original request afterwards (see
 * `attachErrorInterceptor` below).
 *
 * CRITICAL (token rotation, per docs): every refresh returns a NEW
 * access+refresh pair and kills the old refresh token. If the server
 * ever sees an already-used refresh token again it revokes every
 * session for that driver — the mutex here is what prevents two
 * refresh calls from racing and causing exactly that.
 */
const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          await forceLogoutSession();
          return null;
        }

        const device = await getDeviceInfo();
        const body: RefreshTokenApiRequest = {
          refresh_token: refreshToken,
          device: { fcm_token: device.fcm_token, app_version: device.app_version },
        };
        const response = await axios.post<RefreshTokenApiResponse>(
          `${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH}`,
          body,
        );

        const { access_token: accessToken, refresh_token: newRefreshToken } = response.data;
        if (!accessToken || !newRefreshToken) {
          await forceLogoutSession();
          return null;
        }
        // Rotation: overwrite both immediately, inside this same call —
        // the old refresh_token is dead the instant this response lands.
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
          [STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken],
        ]);
        return accessToken;
      } catch {
        await forceLogoutSession();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
};

/** A single `fields` entry can be a plain string or an object carrying its own `message`. */
const fieldMessage = (field: string | BackendDetailField): string | null =>
  typeof field === 'string' ? field : (field.message ?? null);

/**
 * Pulls a human-readable message out of `detail`, in priority order:
 * a plain string, `detail.message`, the first `detail.fields[]`
 * entry's message, or (FastAPI's classic validation shape) every
 * `[{msg}]` item joined together. Returns null if none of those apply
 * so the caller can fall back to a generic message.
 */
const extractDetailMessage = (detail: DetailErrorResponse['detail']): string | null => {
  if (!detail) {
    return null;
  }
  if (typeof detail === 'string') {
    return detail;
  }
  if (Array.isArray(detail)) {
    const messages = detail.map((item) => item.msg).filter((msg): msg is string => Boolean(msg));
    return messages.length > 0 ? messages.join(' ') : null;
  }
  return detail.message ?? (detail.fields?.[0] ? fieldMessage(detail.fields[0]) : null);
};

const extractDetailCode = (detail: DetailErrorResponse['detail']): string | undefined => {
  if (!detail || typeof detail === 'string') {
    return undefined;
  }
  return Array.isArray(detail) ? detail[0]?.type : detail.code;
};

/**
 * Normalizes every error shape this app has actually seen into
 * `ApiError`: the app's own `{success:false, error:{...}}` envelope
 * (docs/api/API_REFERENCE.md), and the live delivery-auth API's
 * `{detail: ...}` shape — confirmed via Swagger on its 404/403/422/429
 * responses to be a string, a validation array, or a `{code,message,
 * fields}` object, inconsistently across endpoints/status codes.
 */
const normalizeError = (error: AxiosError<KnownErrorResponse>): ApiError => {
  const data = error.response?.data;

  const envelopePayload = data && 'error' in data ? data.error : undefined;
  if (envelopePayload) {
    return new ApiError(envelopePayload);
  }

  const detail = data && 'detail' in data ? data.detail : undefined;
  const detailMessage = extractDetailMessage(detail);
  if (detailMessage) {
    return new ApiError({
      code: extractDetailCode(detail) ?? 'ERROR',
      message: detailMessage,
      statusCode: error.response?.status ?? 0,
    });
  }

  return new ApiError({
    code: error.code ?? 'UNKNOWN_ERROR',
    message: error.message || 'Something went wrong. Please try again.',
    statusCode: error.response?.status ?? 0,
  });
};

/**
 * Endpoints that must never trigger the refresh-and-retry flow below:
 * the OTP endpoints are unauthenticated to begin with (a 401 there is a
 * genuine OTP failure, not a stale token), and /logout is already
 * best-effort/fire-and-forget so there's nothing useful a retry adds.
 * GET /me is deliberately NOT in this list — it's Bearer-authenticated
 * and is exactly the case that should get refreshed-and-retried (e.g.
 * bootstrapAuth on launch with an expired access token).
 */
const NO_REFRESH_RETRY_PREFIXES = [
  '/api/v1/delivery/auth/otp/request',
  '/api/v1/delivery/auth/otp/resend',
  '/api/v1/delivery/auth/otp/verify',
  '/api/v1/delivery/auth/logout',
];

const skipsRefreshRetry = (url?: string): boolean =>
  !!url && NO_REFRESH_RETRY_PREFIXES.some((prefix) => url.startsWith(prefix));

/**
 * Normalizes every rejected response to `ApiError` (see
 * docs/api/API_REFERENCE.md error shape) and transparently retries a
 * request once after a successful token refresh on 401 — except for
 * the OTP/logout endpoints above, which surface the error as-is so
 * useAuth can react (e.g. bad OTP).
 */
export const attachErrorInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<KnownErrorResponse>) => {
      const config = error.config as RetriableRequestConfig | undefined;

      // Dev/preview fallback: the real API isn't live yet, so a
      // genuine network error (request sent, no response ever came
      // back) serves mock data instead of dead-ending the screen.
      // Gated on !USE_MOCK_DATA — under mock mode apiClient's adapter
      // already handles every request, so this never needs to run.
      const isNetworkError = !error.response && Boolean(error.request);
      if (!USE_MOCK_DATA && isNetworkError && config) {
        try {
          const mock = resolveMockResponse(config);
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.warn(
              '[mock] Network error reaching the real API — falling back to mock data for',
              (config.method ?? 'get').toUpperCase(),
              config.url,
            );
          }
          const response: AxiosResponse = {
            data: mock.data,
            status: mock.status,
            statusText: 'OK',
            headers: {},
            config,
          };
          return response;
        } catch {
          // No mock handler for this route either — fall through to the normal error path below.
        }
      }

      if (error.response?.status === 401 && config && !config._retry && !skipsRefreshRetry(config.url)) {
        config._retry = true;
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          config.headers.set('Authorization', `Bearer ${newAccessToken}`);
          return instance(config);
        }
      }

      return Promise.reject(normalizeError(error));
    },
  );
};
