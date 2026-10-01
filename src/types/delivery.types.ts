import type { Order, OrderItemKind } from './order.types';

/** A delivery is an order actively being worked by the logged-in driver. */
export type Delivery = Order;

export interface DeliveryStartRequest {
  latitude: number;
  longitude: number;
}

export interface DeliveryStartResponse {
  isAtLocation: boolean;
  distanceMetersFromDestination: number;
}

/** How the driver collects payment on Confirm Delivery. */
export type DeliveryPaymentMethod = 'cash' | 'upiQr';

/** Whether the full payable amount is collected now, or only part of it (rest stays pending). */
export type DeliveryPaymentSplit = 'full' | 'partial';

/** The resolved payment the driver is collecting — `amount` is the full or entered partial rupee amount. */
export interface DeliveryPaymentCollection {
  method: DeliveryPaymentMethod;
  split: DeliveryPaymentSplit;
  amount: number;
  payableAmount: number;
}

/** One line of the per-cylinder-type breakdown sent with Confirm Delivery. */
export interface DeliveryConfirmItem {
  itemId: string;
  kind: OrderItemKind;
  quantity: number;
}

/**
 * `deliveredQuantity`/`emptyCollectedQuantity` are totals across every
 * cylinder type; `items` carries the per-type breakdown. `items` and
 * `payment` aren't confirmed against a live endpoint yet.
 */
export interface DeliveryConfirmRequest {
  deliveredQuantity: number;
  emptyCollectedQuantity: number;
  notes?: string;
  items?: DeliveryConfirmItem[];
  payment?: DeliveryPaymentCollection;
}

export interface DeliveryConfirmResponse {
  deliveryId: string;
  customerOtpRequired: boolean;
}

export interface VerifyCustomerOtpRequest {
  otp: string;
}

/** One cylinder type's line on the Delivery Completed receipt. */
export interface DeliverySummaryItem {
  label: string;
  quantity: number;
}

/**
 * `deliveredItems`/`emptyItems` are the per-type breakdown behind the
 * two totals (only types with quantity > 0); `payment` is what was
 * collected at Confirm Delivery. All three are optional — the live
 * verify-OTP response isn't confirmed to carry them.
 */
export interface DeliverySummary {
  deliveryId: string;
  orderNumber: string;
  deliveredQuantity: number;
  emptyCollectedQuantity: number;
  completedAt: string;
  deliveredItems?: DeliverySummaryItem[];
  emptyItems?: DeliverySummaryItem[];
  payment?: DeliveryPaymentCollection | null;
}
