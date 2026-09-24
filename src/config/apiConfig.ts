/**
 * Expo (managed workflow / Expo Go) has no native build-time file
 * injection, so react-native-config can't work here — this was
 * switched to Expo's built-in env support instead. Only vars prefixed
 * EXPO_PUBLIC_ are exposed to client code; they're loaded automatically
 * from .env / .env.local / .env.development / .env.production at the
 * project root (see .env.example). The old env/ folder's per-file
 * convention was react-native-config-specific and no longer applies.
 *
 * Live API base path is versioned per-endpoint (e.g.
 * /api/v1/delivery/auth/...) rather than on the base URL — see
 * src/api/endpoints/.
 */
const PLACEHOLDER_BASE_URL = 'https://api.mbga.com';
const PLACEHOLDER_TIMEOUT_MS = 10000;

export const API_BASE_URL: string = process.env.EXPO_PUBLIC_API_BASE_URL ?? PLACEHOLDER_BASE_URL;
export const API_TIMEOUT: number = process.env.EXPO_PUBLIC_API_TIMEOUT
  ? Number(process.env.EXPO_PUBLIC_API_TIMEOUT)
  : PLACEHOLDER_TIMEOUT_MS;

/**
 * Single switch for mock mode (src/api/mocks/). Defaults ON since no
 * backend is live yet — set EXPO_PUBLIC_USE_MOCK_DATA=false in .env
 * once real endpoints are ready, no code changes needed.
 *
 * Even with this off, a genuine network error still falls back to
 * mock data automatically (see errorInterceptor.ts) so the app never
 * dead-ends during preview if the API happens to be unreachable.
 */
export const USE_MOCK_DATA: boolean = process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false';
