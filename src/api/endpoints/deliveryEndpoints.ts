export const DELIVERY_ENDPOINTS = {
  TODAY: '/deliveries/today',
  DETAIL: (deliveryId: string): string => `/deliveries/${deliveryId}`,
  START: (deliveryId: string): string => `/deliveries/${deliveryId}/start`,
  CONFIRM: (deliveryId: string): string => `/deliveries/${deliveryId}/confirm`,
  VERIFY_CUSTOMER_OTP: (deliveryId: string): string => `/deliveries/${deliveryId}/verify-customer-otp`,
} as const;
