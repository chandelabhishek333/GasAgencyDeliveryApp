import type { Middleware } from '@reduxjs/toolkit';

/** Lightweight dev-only action logger. No-ops in production builds. */
export const loggerMiddleware: Middleware = () => (next) => (action) => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[store]', action);
  }
  return next(action);
};
