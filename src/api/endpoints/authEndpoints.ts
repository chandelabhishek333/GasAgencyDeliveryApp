export const AUTH_ENDPOINTS = {
  REQUEST_OTP: '/api/v1/delivery/auth/otp/request',
  RESEND_OTP: '/api/v1/delivery/auth/otp/resend',
  VERIFY_OTP: '/api/v1/delivery/auth/otp/verify',
  REFRESH: '/api/v1/delivery/auth/token/refresh',
  LOGOUT: '/api/v1/delivery/auth/logout',
  ME: '/api/v1/delivery/auth/me',
} as const;
