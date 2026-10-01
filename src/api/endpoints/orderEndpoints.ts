import { DELIVERY_ENDPOINTS } from './deliveryEndpoints';

/**
 * The live API has no separate /orders routes — a driver's orders are
 * their deliveries: list = "My deliveries", detail = "Delivery detail",
 * history = "Completed deliveries".
 */
export const ORDER_ENDPOINTS = {
  LIST: DELIVERY_ENDPOINTS.LIST,
  DETAIL: DELIVERY_ENDPOINTS.DETAIL,
  HISTORY: DELIVERY_ENDPOINTS.HISTORY,
} as const;
