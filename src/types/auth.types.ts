import type { Driver } from './driver.types';

export interface LoginRequest {
  phone: string;
}

export interface LoginResponse {
  otpToken: string;
  expiresInSeconds: number;
  /** Cooldown (seconds) before Resend OTP becomes tappable again — drives OTPVerification's countdown timer directly from the backend. */
  resendAfterSeconds: number;
  /** Backend-supplied text for the request/resend success toast, shown as-is (staging embeds the OTP itself, e.g. "OTP request accepted. OTP: 3172" — do not append `dev_otp` on top of this, it's already included). */
  message: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
  otpToken: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  driver: Driver;
}

/**
 * Wire-format types for the live delivery-auth API (confirmed against
 * its Swagger docs — snake_case, no `{success,data}` envelope, unlike
 * the rest of src/types/api.types.ts's `ApiSuccessResponse<T>`
 * convention). authService.ts adapts these to/from the camelCase
 * LoginRequest/LoginResponse/VerifyOtpRequest/VerifyOtpResponse types
 * above so nothing above the service layer needs to know the wire
 * shape differs.
 */
export interface ApiDeviceInfo {
  device_id: string;
  device_type: string;
  device_name: string;
  app_version: string;
  fcm_token: string;
}

// `login_channel` was dropped — the backend no longer accepts it on
// /otp/request (or /otp/resend, which shares this same request shape).
export interface RequestOtpApiRequest {
  mobile_number: string;
  country_code: string;
  device: ApiDeviceInfo;
}

export interface RequestOtpApiResponse {
  request_id: string;
  message: string;
  expires_in: number;
  resend_after: number;
  code: string;
  /** Staging-only: the actual OTP, when the SMS gateway isn't wired up. Not guaranteed present. */
  dev_otp?: string;
}

export interface VerifyOtpApiRequest {
  request_id: string;
  mobile_number: string;
  country_code: string;
  login_channel: string;
  otp: string;
  device: ApiDeviceInfo;
}

export interface VerifyOtpApiResponse {
  token: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
  user_id: string;
  role: string;
  login_channel: string;
  is_new_user: boolean;
  code: string;
  message: string;
}

/**
 * Wire-format response for GET /me — confirmed via Swagger. `merchant`
 * and `delivery_profile` are left as opaque records since their inner
 * shapes (the "same as verify" fields the docs reference) haven't been
 * shared; only `full_name`/`vehicle_number` are read off
 * `delivery_profile`, defensively, until that's confirmed.
 */
export interface MeApiResponse {
  user_id: string;
  login_channel: string;
  user_type: string;
  role: string;
  account_status: string;
  next_action: string;
  merchant: Record<string, unknown> | null;
  delivery_profile: Record<string, unknown> | null;
  display_name: string;
  mobile_number: string;
  country_code: string;
  effective_permissions: string[];
}

/** authService.getProfile()'s return shape — the app's Driver identity plus the permission/status fields GET /me adds on top. */
export interface AuthProfile extends Driver {
  accountStatus: string;
  effectivePermissions: string[];
}

/** POST /token/refresh request body. `device` is optional — send it when the FCM token or app version changed; omitted fields keep their previous stored value. */
export interface RefreshTokenApiRequest {
  refresh_token: string;
  device?: {
    fcm_token: string;
    app_version: string;
  };
}

/**
 * POST /token/refresh response — flat, not nested under `token` (unlike
 * /otp/verify). Refresh tokens rotate: this pair replaces the stored
 * one in full, and the old refresh_token is dead the moment this
 * response is received.
 */
export interface RefreshTokenApiResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

/** POST /logout request body. */
export interface LogoutApiRequest {
  refresh_token: string;
}
