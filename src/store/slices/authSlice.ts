import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../api/services/authService';
import { userService } from '../../api/services/userService';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { setPendingAuthToast } from '../../utils/pendingAuthToast';
import type { Driver, LoginRequest, VerifyOtpRequest } from '../../types';

interface PendingOtp {
  phone: string;
  otpToken: string;
  /** Backend-supplied cooldown (seconds) before Resend OTP is tappable — OTPVerification seeds its countdown from this. */
  resendAfterSeconds: number;
  /** Backend-supplied success copy, shown as OTPVerification's arrival toast (not Login's — see useLogin.ts). */
  message: string;
}

interface AuthState {
  driver: Driver | null;
  accessToken: string | null;
  refreshToken: string | null;
  /** From GET /me's `account_status` (e.g. "ACTIVE") — distinct from `driver.onDuty`, which is the local duty toggle. */
  accountStatus: string | null;
  /** From GET /me's `effective_permissions` — gate action buttons on this, e.g. hide "Update status" when it's missing `deliveries.update_status`. */
  effectivePermissions: string[];
  /** Set after `loginWithPhone` succeeds; consumed by `verifyOtp`. */
  pendingOtp: PendingOtp | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  /** True once the AsyncStorage session check on app launch has completed. */
  isBootstrapped: boolean;
}

const initialState: AuthState = {
  driver: null,
  accessToken: null,
  refreshToken: null,
  accountStatus: null,
  effectivePermissions: [],
  pendingOtp: null,
  status: 'idle',
  error: null,
  isBootstrapped: false,
};

/**
 * Screen 2 — sends the duty login OTP for a phone number. Login
 * navigates to OTPVerification immediately on success — the backend's
 * success copy (`message`) and cooldown (`resendAfterSeconds`) travel
 * via `pendingOtp` and are shown as OTPVerification's own arrival
 * toast/countdown, not Login's.
 */
export const loginWithPhone = createAsyncThunk<PendingOtp, LoginRequest, { rejectValue: string }>(
  'auth/loginWithPhone',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authService.login(payload);
      return {
        phone: payload.phone,
        otpToken: response.otpToken,
        resendAfterSeconds: response.resendAfterSeconds,
        message: response.message,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/**
 * Resends the duty login OTP for the in-flight session, refreshing
 * `pendingOtp` (new `otpToken`/`resendAfterSeconds`/`message`) on
 * success. The backend kills the old `request_id` as soon as a resend
 * succeeds, so `otpToken` must be replaced — verify would fail with it. Deliberately doesn't touch `status`/`error` — those drive
 * the Verify button's own spinner and error text, and a resend
 * shouldn't flash either.
 */
export const resendOtp = createAsyncThunk<
  PendingOtp,
  void,
  { state: { auth: AuthState }; rejectValue: string }
>('auth/resendOtp', async (_, { getState, rejectWithValue }) => {
  const { pendingOtp } = getState().auth;
  if (!pendingOtp) {
    return rejectWithValue('OTP session expired. Please request a new code.');
  }
  try {
    const response = await authService.resendOtp(pendingOtp.otpToken);
    return {
      phone: pendingOtp.phone,
      otpToken: response.otpToken,
      resendAfterSeconds: response.resendAfterSeconds,
      message: response.message,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/**
 * Screen 3 — verifies the duty OTP, persists the resulting token pair,
 * then fetches the driver's own profile (GET /me) to complete the
 * session. The verify response itself only carries tokens.
 */
export const verifyOtp = createAsyncThunk<
  { accessToken: string; refreshToken: string; driver: Driver; accountStatus: string; effectivePermissions: string[] },
  Omit<VerifyOtpRequest, 'otpToken'>,
  { state: { auth: AuthState }; rejectValue: string }
>('auth/verifyOtp', async (payload, { getState, rejectWithValue }) => {
  const { pendingOtp } = getState().auth;
  if (!pendingOtp) {
    return rejectWithValue('OTP session expired. Please request a new code.');
  }
  try {
    const { accessToken, refreshToken, fcmToken } = await authService.verifyOtp({
      ...payload,
      otpToken: pendingOtp.otpToken,
    });
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
      [STORAGE_KEYS.FCM_TOKEN_SYNCED, fcmToken],
    ]);
    const profile = await authService.getProfile();
    return {
      accessToken,
      refreshToken,
      driver: profile,
      accountStatus: profile.accountStatus,
      effectivePermissions: profile.effectivePermissions,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/** Runs once on app launch: restores a session from AsyncStorage, if any. */
export const bootstrapAuth = createAsyncThunk<
  {
    accessToken: string;
    refreshToken: string | null;
    driver: Driver;
    accountStatus: string;
    effectivePermissions: string[];
  } | null,
  void,
  { rejectValue: string }
>('auth/bootstrapAuth', async (_, { rejectWithValue }) => {
  try {
    const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      return null;
    }
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const profile = await authService.getProfile();
    return {
      accessToken,
      refreshToken,
      driver: profile,
      accountStatus: profile.accountStatus,
      effectivePermissions: profile.effectivePermissions,
    };
  } catch (error) {
    await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
    return rejectWithValue(getErrorMessage(error));
  }
});

/**
 * Clears the session both in Redux and in AsyncStorage. Per the
 * logout docs, sign-out can never get stuck waiting on the server: the
 * revoke call is fired without being awaited, and the local session is
 * cleared unconditionally right away.
 */
export const logoutUser = createAsyncThunk<void, void, { state: { auth: AuthState }; rejectValue: string }>(
  'auth/logoutUser',
  async (_, { getState, rejectWithValue }) => {
    const { refreshToken } = getState().auth;
    if (refreshToken) {
      authService.logout(refreshToken).catch(() => {
        // Best-effort — the local session is cleared below regardless of
        // whether the server-side logout call succeeds.
      });
    }
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
    // Set only once the local session is actually clearing — Login
    // picks this up on mount, after RootNavigator swaps back to AuthStack.
    setPendingAuthToast('Logged out successfully');
  },
);

/**
 * Signs the driver out of every device (POST /logout-all). Unlike
 * logoutUser, this waits for the server: the whole point is revoking the
 * *other* sessions, so if the call fails the driver stays signed in here
 * and sees the error, rather than being told it worked when it didn't.
 */
export const logoutAll = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutAll',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logoutAll();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
    await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN]).catch(() => {});
    setPendingAuthToast('Signed out of all devices');
  },
);

/**
 * Loads the live duty state for Home's toggle. The API has no GET
 * /driver/status, so it comes from GET /driver/profile's `onDuty`.
 */
export const syncDutyStatus = createAsyncThunk<boolean, void, { rejectValue: string }>(
  'auth/syncDutyStatus',
  async (_, { rejectWithValue }) => {
    try {
      return (await userService.getProfile()).onDuty;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/**
 * Home's duty toggle: PATCH /driver/status. The switch flips immediately
 * (pending) and flips back if the server refuses (rejected) — the arg is
 * the new value, so the previous one is always its opposite.
 */
export const updateDutyStatus = createAsyncThunk<boolean, boolean, { rejectValue: string }>(
  'auth/updateDutyStatus',
  async (onDuty, { rejectWithValue }) => {
    try {
      return (await userService.updateDutyStatus(onDuty)).onDuty;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    /** Local duty on/off toggle — Home's Duty Status card and the header badge both read `driver.onDuty`. */
    setDutyStatus(state, action: PayloadAction<boolean>) {
      if (state.driver) {
        state.driver.onDuty = action.payload;
      }
    },
    /**
     * Resets straight to `initialState`, same as `logoutUser.fulfilled` —
     * dispatched by errorInterceptor.ts when a 401 survives a refresh
     * attempt (refresh token missing/expired/revoked), so RootNavigator
     * swaps back to AuthStack even though the driver never tapped Logout.
     */
    forceLogout() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithPhone.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginWithPhone.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pendingOtp = action.payload;
      })
      .addCase(loginWithPhone.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to send OTP.';
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.pendingOtp = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.driver = action.payload.driver;
        state.accountStatus = action.payload.accountStatus;
        state.effectivePermissions = action.payload.effectivePermissions;
        state.pendingOtp = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Invalid OTP.';
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.isBootstrapped = true;
        if (action.payload) {
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.driver = action.payload.driver;
          state.accountStatus = action.payload.accountStatus;
          state.effectivePermissions = action.payload.effectivePermissions;
        }
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.isBootstrapped = true;
      })
      // Whether the remote /auth/logout call succeeded or failed, the
      // local session (and its AsyncStorage tokens) is already cleared —
      // reset to a logged-out state either way.
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, () => initialState)
      .addCase(logoutAll.fulfilled, () => initialState)
      .addCase(syncDutyStatus.fulfilled, (state, action) => {
        if (state.driver) {
          state.driver.onDuty = action.payload;
        }
      })
      .addCase(updateDutyStatus.pending, (state, action) => {
        if (state.driver) {
          state.driver.onDuty = action.meta.arg;
        }
      })
      .addCase(updateDutyStatus.fulfilled, (state, action) => {
        if (state.driver) {
          state.driver.onDuty = action.payload;
        }
      })
      .addCase(updateDutyStatus.rejected, (state, action) => {
        if (state.driver) {
          state.driver.onDuty = !action.meta.arg;
        }
      });
  },
});

export const { clearAuthError, setDutyStatus, forceLogout } = authSlice.actions;
export const authReducer = authSlice.reducer;
export type { AuthState };
