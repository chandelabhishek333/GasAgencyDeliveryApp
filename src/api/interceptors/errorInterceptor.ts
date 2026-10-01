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
 *
 * Only a response from the server (e.g. 401 for a revoked/reused
 * refresh token) ends the session. A network error or timeout — or a
 * local failure building the body — resolves null and keeps the stored
 * pair, so a signal drop on the road doesn't sign the driver out; the
 * next request simply tries the refresh again.
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
          [STORAGE_KEYS.FCM_TOKEN_SYNCED, device.fcm_token],
        ]);
        return accessToken;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          await forceLogoutSession();
        }
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
};

/**
 * Pushes a rotated FCM token to the server. The live API has no
 * dedicated device-update endpoint — /token/refresh's optional `device`
 * is the documented way to report a changed token — so this runs an
 * ordinary refresh through the same mutex as the 401 path.
 *
 * No-op when signed out, or when the server already holds the current
 * token (FCM_TOKEN_SYNCED, recorded on OTP verify and on every refresh).
 * Call after the token is persisted: on launch and from onTokenRefresh.
 */
export const syncFcmTokenWithServer = async (): Promise<void> => {
  const [[, refreshToken], [, currentToken], [, syncedToken]] = await AsyncStorage.multiGet([
    STORAGE_KEYS.REFRESH_TOKEN,
    STORAGE_KEYS.FCM_TOKEN,
    STORAGE_KEYS.FCM_TOKEN_SYNCED,
  ]);
  if (!refreshToken || !currentToken || currentToken === syncedToken) {
    return;
  }
  await refreshAccessToken();
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

/** Live-API failures that mean "endpoint not deployed / server down", not "request was wrong". */
const DEV_MOCK_FALLBACK_STATUSES = new Set([404, 500, 502, 503, 504]);
const AUTH_PATH_PREFIX = '/api/v1/delivery/auth/';

/**
 * Dev-only safety net while the live backend is still being deployed:
 * a network error, timeout, 404 or 5xx serves the route's mock data
 * instead of an error, so no screen goes blank on the device.
 *
 * - Never in release builds — real users must see real failures.
 * - Never under USE_MOCK_DATA — the mock adapter already answers everything.
 * - Never for /auth/* — a faked OTP verify or token refresh would "log
 *   in" with a mock token, and auth errors (bad OTP, 404 request id)
 *   must reach the UI as-is.
 * - Never for a cancelled request.
 * - 401 isn't in the list, so the refresh-and-retry path below still runs.
 */
const shouldServeDevMock = (error: AxiosError, config: RetriableRequestConfig): boolean => {
  if (!__DEV__ || USE_MOCK_DATA || axios.isCancel(error)) {
    return false;
  }
  if (config.url?.startsWith(AUTH_PATH_PREFIX)) {
    return false;
  }
  // No response at all = network error or timeout (ECONNABORTED).
  return !error.response || DEV_MOCK_FALLBACK_STATUSES.has(error.response.status);
};

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

      if (config && shouldServeDevMock(error, config)) {
        try {
          const mock = resolveMockResponse(config);
          // eslint-disable-next-line no-console
          console.warn(
            `[API Fallback] Live endpoint error (${error.response?.status ?? error.code ?? 'network'}) -> using mock data:`,
            (config.method ?? 'get').toUpperCase(),
            config.url,
          );
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
