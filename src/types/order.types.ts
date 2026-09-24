export type OrderStatus = 'pending' | 'in_progress' | 'completed';

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
  status: OrderStatus;
  items: OrderItem[];
  distanceKm?: number;
  /** Set once status is 'completed' — the actual delivery time (e.g. "11:20 AM"), distinct from the scheduled timeSlot range. Used by Delivery History. */
  completedAt?: string;
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
