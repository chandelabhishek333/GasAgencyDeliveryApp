import type { DeliveryPaymentMethod, DeliveryPaymentSplit } from '../types';

/** Shared display labels for payment collection — Confirm Delivery's picker and Completed Order Details. */
export const PAYMENT_METHOD_LABEL: Record<DeliveryPaymentMethod, string> = {
  cash: 'Cash',
  upiQr: 'QR / UPI',
};

export const PAYMENT_SPLIT_LABEL: Record<DeliveryPaymentSplit, string> = {
  full: 'Full Payment',
  partial: 'Partial Payment',
};
