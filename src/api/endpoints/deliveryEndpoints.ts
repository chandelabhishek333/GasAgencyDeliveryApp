import { DELIVERY_API_PREFIX } from './basePath';

const DELIVERIES = `${DELIVERY_API_PREFIX}/deliveries`;

/** Paths match the live OpenAPI spec (GET/POST under /api/v1/delivery/deliveries). */
export const DELIVERY_ENDPOINTS = {
  TODAY: `${DELIVERIES}/today`,
  LIST: DELIVERIES,
  HISTORY: `${DELIVERIES}/history`,
  DETAIL: (deliveryId: string): string => `${DELIVERIES}/${deliveryId}`,
  START: (deliveryId: string): string => `${DELIVERIES}/${deliveryId}/start`,
  CONFIRM: (deliveryId: string): string => `${DELIVERIES}/${deliveryId}/confirm`,
  VERIFY_CUSTOMER_OTP: (deliveryId: string): string => `${DELIVERIES}/${deliveryId}/verify-customer-otp`,
} as const;
