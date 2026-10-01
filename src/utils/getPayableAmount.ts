import type { Order } from '../types';

/**
 * Stand-in until the API sends a per-order amount — the figure Order
 * Details and Confirm Delivery have shown since the bill card was built.
 */
const PLACEHOLDER_PAYABLE_AMOUNT = 14250;

/** Rupees the customer owes for `order`, falling back to the placeholder while `payableAmount` isn't in the API. */
export const getPayableAmount = (order: Pick<Order, 'payableAmount'>): number =>
  order.payableAmount ?? PLACEHOLDER_PAYABLE_AMOUNT;
