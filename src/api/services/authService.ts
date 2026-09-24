import { apiClient } from '../client';
import { AUTH_ENDPOINTS } from '../endpoints/authEndpoints';
import { getDeviceInfo } from '../../utils/getDeviceInfo';
import type {
  AuthProfile,
  LoginRequest,
  LoginResponse,
  LogoutApiRequest,
  MeApiResponse,
  RequestOtpApiResponse,
  VerifyOtpApiRequest,
  VerifyOtpApiResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '../../types';

// Confirmed via a live /otp/request call (202 OTP_REQUEST_ACCEPTED).
const LOGIN_CHANNEL = 'DELIVERY';
// The UI only ever collects a 10-digit Indian mobile number (Login's
// fixed "+91" prefix) — never sent as part of `phone` itself.
const COUNTRY_CODE = '+91';

/**
 * Auth domain — duty login (phone), OTP request/resend/verify, and the
 * authenticated driver's own profile. Token persistence is the
 * caller's responsibility (see src/store/slices/authSlice.ts).
 *
 * The live delivery-auth API's wire format (confirmed via Swagger) is
 * snake_case with no `{success,data}` envelope, unlike the rest of
 * src/types/api.types.ts's ApiSuccessResponse<T> convention — every
 * method here adapts to/from that so callers keep working with the
 * app's existing camelCase LoginRequest/LoginResponse/etc. shapes.
 */

/** request()/resend() share this exact body — `login_channel` was removed, no longer accepted by the backend. */
const buildRequestOtpBody = async (payload: LoginRequest) => ({
  mobile_number: payload.phone,
  country_code: COUNTRY_CODE,
  device: await getDeviceInfo(),
});

// `data.message` is shown as-is — on staging it already embeds the OTP
// itself (e.g. "OTP request accepted. OTP: 3172"), so appending
// `dev_otp` on top of that produced a visible duplicate.
const toLoginResponse = (data: RequestOtpApiResponse): LoginResponse => ({
  otpToken: data.request_id,
  expiresInSeconds: data.expires_in,
  resendAfterSeconds: data.resend_after,
  message: data.message,
});

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<RequestOtpApiResponse>(
      AUTH_ENDPOINTS.REQUEST_OTP,
      await buildRequestOtpBody(payload),
    );
    return toLoginResponse(response.data);
  },

  async resendOtp(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<RequestOtpApiResponse>(
      AUTH_ENDPOINTS.RESEND_OTP,
      await buildRequestOtpBody(payload),
    );
    return toLoginResponse(response.data);
  },

  // `payload.otpToken` carries the `request_id` handed back by
  // login()/resendOtp() above — the live verify endpoint has no
  // separate driver payload, so the profile is fetched separately via
  // getProfile() (GET /me).
  async verifyOtp(
    payload: VerifyOtpRequest,
  ): Promise<Pick<VerifyOtpResponse, 'accessToken' | 'refreshToken'>> {
    const body: VerifyOtpApiRequest = {
      request_id: payload.otpToken,
      mobile_number: payload.phone,
      country_code: COUNTRY_CODE,
      login_channel: LOGIN_CHANNEL,
      otp: payload.otp,
      device: await getDeviceInfo(),
    };
    const response = await apiClient.post<VerifyOtpApiResponse>(AUTH_ENDPOINTS.VERIFY_OTP, body);
    return {
      accessToken: response.data.token.access_token,
      refreshToken: response.data.token.refresh_token,
    };
  },

  // `delivery_profile`'s own inner shape isn't confirmed yet (the docs
  // just say "same as verify"), so full_name/vehicle_number/on_duty are
  // read off it defensively — a differently-named field degrades to a
  // placeholder instead of crashing.
  async getProfile(): Promise<AuthProfile> {
    const response = await apiClient.get<MeApiResponse>(AUTH_ENDPOINTS.ME);
    const data = response.data;
    const deliveryProfile = (data.delivery_profile ?? {}) as Record<string, unknown>;
    return {
      id: data.user_id,
      name: data.display_name || String(deliveryProfile.full_name ?? ''),
      phone: data.mobile_number,
      vehicleNumber: String(deliveryProfile.vehicle_number ?? ''),
      role: data.role,
      onDuty: Boolean(deliveryProfile.on_duty ?? deliveryProfile.is_on_duty ?? true),
      avatarInitials: typeof deliveryProfile.avatar_initials === 'string' ? deliveryProfile.avatar_initials : undefined,
      accountStatus: data.account_status,
      effectivePermissions: data.effective_permissions ?? [],
    };
  },

  // Per the docs: sign-out can never get stuck — callers (authSlice)
  // don't await this before clearing the local session, so this stays
  // a plain fire-once POST with no retry/blocking logic of its own.
  async logout(refreshToken: string): Promise<void> {
    const body: LogoutApiRequest = { refresh_token: refreshToken };
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT, body);
  },
};
