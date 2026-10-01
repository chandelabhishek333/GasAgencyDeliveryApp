/**
 * Bare React Native CLI has no built-in env injection — `react-native-config`
 * reads the root `.env` at native build time and exposes it here as `Config`.
 * See .env.example for the var names and android/app/build.gradle for the
 * Gradle hook that wires the native side up.
 *
 * Live API base path is versioned per-endpoint (e.g.
 * /api/v1/delivery/auth/...) rather than on the base URL — see
 * src/api/endpoints/.
 */
import Config from 'react-native-config';

const PLACEHOLDER_BASE_URL = 'https://mbga.clocktales.com';
const PLACEHOLDER_TIMEOUT_MS = 15000;

// Trailing slashes stripped: endpoint paths all start with "/", and the
// token-refresh call builds `${API_BASE_URL}${path}` by hand.
export const API_BASE_URL: string = (Config.API_BASE_URL || PLACEHOLDER_BASE_URL).replace(/\/+$/, '');
export const API_TIMEOUT: number = Config.API_TIMEOUT ? Number(Config.API_TIMEOUT) : PLACEHOLDER_TIMEOUT_MS;

/**
 * Single switch for mock mode (src/api/mocks/). Defaults ON if the var
 * is unset; .env sets it false now that the live API is wired up.
 *
 * Even with this off, dev builds fall back to mock data when a live
 * non-auth call fails (network error, timeout, 404, 5xx) — see
 * errorInterceptor.ts — so the app never dead-ends while endpoints are
 * still being deployed. Release builds never serve mock data.
 */
export const USE_MOCK_DATA: boolean = Config.USE_MOCK_DATA !== 'false';
