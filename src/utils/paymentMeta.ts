import type { ApiPaymentMethod, DeliveryPaymentMethod, DeliveryPaymentSplit } from '../types';

/** Shared display labels for payment collection — Confirm Delivery's picker, receipts and history. */
export const PAYMENT_METHOD_LABEL: Record<DeliveryPaymentMethod, string> = {
  cash: 'Cash',
  upi_qr: 'QR / UPI',
  upiQr: 'QR / UPI',
};

export const PAYMENT_SPLIT_LABEL: Record<DeliveryPaymentSplit, string> = {
  full: 'Full Payment',
  partial: 'Partial Payment',
};

/** The app's older `upiQr` (and any casing of `upi_qr`) -> the API's `upi_qr`. */
export const toApiPaymentMethod = (method: string): ApiPaymentMethod =>
  method.toLowerCase() === 'cash' ? 'cash' : 'upi_qr';
