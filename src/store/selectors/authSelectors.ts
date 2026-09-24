import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export const selectAuthState = (state: RootState): RootState['auth'] => state.auth;
export const selectDriver = (state: RootState) => state.auth.driver;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthBootstrapped = (state: RootState) => state.auth.isBootstrapped;
export const selectPendingOtp = (state: RootState) => state.auth.pendingOtp;
export const selectAccountStatus = (state: RootState) => state.auth.accountStatus;
export const selectEffectivePermissions = (state: RootState) => state.auth.effectivePermissions;

export const selectIsAuthenticated = createSelector(
  selectAccessToken,
  (accessToken): boolean => Boolean(accessToken),
);
