import { DELIVERY_ENDPOINTS } from './deliveryEndpoints';

/**
 * The live API has no separate /orders routes — a driver's orders are
 * their deliveries: list = today's deliveries, history = past ones,
 * completed detail = the read-only view of a finished one.
 */
export const ORDER_ENDPOINTS = {
  LIST: DELIVERY_ENDPOINTS.TODAY,
  HISTORY: DELIVERY_ENDPOINTS.HISTORY,
  COMPLETED_DETAIL: DELIVERY_ENDPOINTS.COMPLETED_DETAIL,
} as const;
