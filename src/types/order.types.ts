/**
 * Master cylinder types — the API's `cylinderType` enum. Typed as plain
 * `string` on the wire types below so a type the backend adds later
 * still renders instead of failing to parse.
 */
export type CylinderType =
  | '5_KG_DOMESTIC'
  | '14.2_KG_DOMESTIC'
  | '19_KG_COMMERCIAL'
  | '35_KG_INDUSTRIAL'
  | '47.5_KG_INDUSTRIAL';

/** The API's delivery lifecycle: pending -> out_for_delivery -> completed (or failed). */
export type OrderStatus = 'pending' | 'out_for_delivery' | 'completed' | 'failed';

/** API `items[]` — one cylinder type to deliver, with its line price. */
export interface DeliveryItemResponse {
  cylinderType: string;
  label: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/** API `emptyReturns[]` — empties to collect for one type: expectedQuantity = currentOrderQuantity + customerPreviousDue. */
export interface EmptyReturnItem {
  cylinderType: string;
  label: string;
  currentOrderQuantity: number;
  customerPreviousDue: number;
  expectedQuantity: number;
}

/** API `billing` — totalPayableAmount is what the driver collects against. */
export interface BillingSummary {
  orderSubtotal: number;
  taxAmount: number;
  customerPreviousBalance: number;
  totalPayableAmount: number;
}

/**
 * API `customer`. `isLocationCaptured` = the customer's coordinates are
 * already locked on the server, so verify-location only checks the
 * driver against them instead of saving new ones.
 */
export interface CustomerInfo {
  id?: string;
  name: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  isLocationCaptured?: boolean;
}

/**
 * Distinguishes the two line-item roles shown on Order Detail /
 * Confirm Delivery (🛢️ cylinders being delivered vs. 📦 empties being
 * collected back) so consumers never have to infer it from `label` or
 * array position.
 */
export type OrderItemKind = 'cylinderDelivery' | 'emptyCollection';

/**
 * One order line in the app's flattened view of a delivery: each API
 * `items[]` entry becomes a `cylinderDelivery` line and each
 * `emptyReturns[]` entry an `emptyCollection` line.
 */
export interface OrderItem {
  id: string;
  kind: OrderItemKind;
  /** The API `cylinderType` — the key sent back in update-items and confirm. */
  cylinderType: string;
  label: string;
  /** Delivered lines: quantity ordered. Empty lines: `expectedQuantity` (this order + customer's previous due). */
  quantity: number;
  /** Delivered lines only. */
  unitPrice?: number;
  totalPrice?: number;
  /** Empty lines only — the two parts of `quantity`. */
  currentOrderQuantity?: number;
  customerPreviousDue?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  /** Scheduled delivery day, as the API sends it (ISO "YYYY-MM-DD"). */
  deliveryDate?: string;
  customer: CustomerInfo;
  distanceKm?: number;
  /** Delivered lines and empty lines together — filter on `kind`. */
  items: OrderItem[];
  billing: BillingSummary;
  /** Set once status is 'completed' — the actual delivery time (e.g. "11:20 AM"). */
  completedAt?: string;
}

export type OrderHistoryPeriod = 'today' | 'week' | 'all';

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  period?: OrderHistoryPeriod;
}
