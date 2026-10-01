import type { DeliveryPaymentCollection } from './delivery.types';

/** Matches the live API's DriverDeliveryStatus. `failed` = the delivery couldn't be completed. */
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

/**
 * Distinguishes the two line-item roles shown on Order Detail /
 * Confirm Delivery (🛢️ cylinders being delivered vs. 📦 empties being
 * collected back) so consumers never have to infer it from `label` or
 * array position.
 */
export type OrderItemKind = 'cylinderDelivery' | 'emptyCollection';

export interface OrderItem {
  id: string;
  kind: OrderItemKind;
  label: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  timeSlotStart: string;
  timeSlotEnd: string;
  /** Scheduled delivery day, as the API sends it (ISO "YYYY-MM-DD"). Shown on Order Detail via formatDeliveryDate. */
  deliveryDate?: string;
  /** Amount the customer owes for this order, in rupees. Not in the API yet — read via getPayableAmount(), which falls back to a placeholder. */
  payableAmount?: number;
  status: OrderStatus;
  items: OrderItem[];
  distanceKm?: number;
  /** Set once status is 'completed' — the actual delivery time (e.g. "11:20 AM"), distinct from the scheduled timeSlot range. Used by Delivery History. */
  completedAt?: string;
  /** Set once status is 'completed' — how payment was settled (method, full/partial, amount collected). Shape not yet confirmed against the API. */
  payment?: DeliveryPaymentCollection;
}

export type OrderHistoryPeriod = 'today' | 'week' | 'all';

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  // TODO: confirm param name/values — used by Delivery History's
  // Today/This Week/All tabs (GET /orders/history).
  period?: OrderHistoryPeriod;
}
