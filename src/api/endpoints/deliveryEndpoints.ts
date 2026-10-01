import { DELIVERY_API_PREFIX } from './basePath';

const DELIVERIES = `${DELIVERY_API_PREFIX}/deliveries`;

/**
 * Paths match the live OpenAPI spec (docs/MBGA_Delivery_API_Specification.md
 * v3.0), in the order the driver hits them. There is no list-all or
 * per-id GET — orders come from TODAY, finished ones from COMPLETED_DETAIL.
 */
export const DELIVERY_ENDPOINTS = {
  /** Prefix shared by every route below — used by the mocks to match `{id}` paths. */
  BASE: DELIVERIES,
  TODAY: `${DELIVERIES}/today`,
  HISTORY: `${DELIVERIES}/history`,
  OUT_FOR_DELIVERY: (deliveryId: string): string => `${DELIVERIES}/${deliveryId}/out-for-delivery`,
  VERIFY_LOCATION: (deliveryId: string): string => `${DELIVERIES}/${deliveryId}/verify-location`,
  UPDATE_ITEMS: (deliveryId: string): string => `${DELIVERIES}/${deliveryId}/update-items`,
  GENERATE_QR: (deliveryId: string): string => `${DELIVERIES}/${deliveryId}/generate-qr`,
  CONFIRM: (deliveryId: string): string => `${DELIVERIES}/${deliveryId}/confirm`,
  VERIFY_CUSTOMER_OTP: (deliveryId: string): string => `${DELIVERIES}/${deliveryId}/verify-customer-otp`,
  COMPLETED_DETAIL: (deliveryId: string): string => `${DELIVERIES}/${deliveryId}/completed-detail`,
} as const;
