import type { CustomerInfo, Order, OrderHistoryPeriod, OrderStatus } from './order.types';

/** A delivery is an order actively being worked by the logged-in driver. */
export type Delivery = Order;

/** One cylinder type and a count — the item shape of update-items and confirm requests. */
export interface CylinderQuantity {
  cylinderType: string;
  quantity: number;
}

// ---- Out for delivery / location ----

/** POST /deliveries/{id}/out-for-delivery */
export interface OutForDeliveryResponse {
  deliveryId: string;
  orderNumber: string;
  status: OrderStatus;
  updatedAt: string;
}

/** POST /deliveries/{id}/verify-location body — the driver's GPS fix. */
export interface VerifyLocationRequest {
  latitude: number;
  longitude: number;
}

export interface VerifyLocationResponse {
  deliveryId: string;
  isAtLocation: boolean;
  distanceMetersFromDestination: number;
  /** True once the customer's coordinates are saved on the server (including by this call). */
  isLocationCaptured: boolean;
  message?: string;
}

// ---- Doorstep order update ----

/** PUT /deliveries/{id}/update-items — the server answers with the recalculated delivery. */
export interface UpdateOrderItemsRequest {
  /** The full new set of cylinder types to deliver (quantity > 0 each). */
  updatedItems: CylinderQuantity[];
  reason: string;
}

// ---- Payment ----

/** How the driver collects payment. `upiQr` is the app's older spelling — mappers normalise it to `upi_qr`. */
export type DeliveryPaymentMethod = 'cash' | 'upi_qr' | 'upiQr';

/** The method values the API sends and accepts. */
export type ApiPaymentMethod = 'cash' | 'upi_qr';

/** Whether the full payable amount is collected now, or only part of it (rest stays pending). */
export type DeliveryPaymentSplit = 'full' | 'partial';

/** POST /deliveries/{id}/generate-qr */
export interface GenerateQrRequest {
  amount: number;
  paymentSplit: DeliveryPaymentSplit;
}

export interface GenerateQrResponse {
  deliveryId: string;
  orderNumber: string;
  amount: number;
  upiString: string;
  qrImageUrl: string;
  expiresInSeconds: number;
}

// ---- Confirm + customer OTP ----

export interface ConfirmDeliveryPayment {
  method: ApiPaymentMethod;
  split: DeliveryPaymentSplit;
  amountCollected: number;
  payableAmount: number;
  /** payableAmount - amountCollected — recorded on the customer's ledger. */
  pendingBalance: number;
}

/** POST /deliveries/{id}/confirm */
export interface ConfirmDeliveryRequest {
  deliveredItems: CylinderQuantity[];
  collectedEmpties: CylinderQuantity[];
  payment: ConfirmDeliveryPayment;
  driverNotes?: string;
}

export interface ConfirmDeliveryResponse {
  deliveryId: string;
  customerOtpRequired: boolean;
  /** e.g. "IN_APP_NOTIFICATION" — the OTP goes to the customer's app, not SMS. */
  otpChannel?: string;
  message?: string;
}

export interface VerifyCustomerOtpRequest {
  otp: string;
}

/** One cylinder type's line on a receipt (delivered or empties collected). */
export interface ReceiptItem {
  cylinderType: string;
  label: string;
  quantity: number;
}

/** How the empties ledger moved: whatever wasn't collected is added to the customer's pending due. */
export interface EmptyDueSummary {
  expectedTotal: number;
  collectedTotal: number;
  addedToCustomerPendingDue: number;
}

export interface ReceiptPayment {
  method: ApiPaymentMethod;
  split: DeliveryPaymentSplit;
  totalBillAmount: number;
  amountCollected: number;
  pendingBalance: number;
}

/** POST /deliveries/{id}/verify-customer-otp — the Delivery Completed receipt. */
export interface DeliverySummary {
  deliveryId: string;
  orderNumber: string;
  status: OrderStatus;
  /** Display time, e.g. "04:28 PM". */
  completedAt: string;
  totalDeliveredQuantity: number;
  deliveredItems: ReceiptItem[];
  totalEmptyCollectedQuantity: number;
  emptyCollectedItems: ReceiptItem[];
  emptyDueSummary: EmptyDueSummary;
  payment: ReceiptPayment;
}

// ---- Completed detail + history ----

export interface CompletedDeliveryPayment {
  method: ApiPaymentMethod;
  split: DeliveryPaymentSplit;
  totalAmount: number;
  amountPaid: number;
  pendingBalance: number;
}

/** GET /deliveries/{id}/completed-detail — the read-only view of a finished delivery. */
export interface CompletedDeliveryDetail {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  deliveryDate?: string;
  completedAt?: string;
  customer: CustomerInfo;
  deliveredItems: ReceiptItem[];
  emptyItems: ReceiptItem[];
  /** Null for a failed delivery, where nothing was collected. */
  payment: CompletedDeliveryPayment | null;
  driverNotes?: string;
}

/** One row of GET /deliveries/history. */
export interface HistoryDeliveryEntry {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  deliveryDate?: string;
  completedAt?: string;
  totalDeliveredCount: number;
  totalEmptiesCount: number;
  /** Server-built, e.g. "4 × 19 KG, 2 × 47.5 KG". */
  itemsSummary: string;
  /** `status` is e.g. "FULL" / "PARTIAL". Null when nothing was collected. */
  payment: { method: ApiPaymentMethod; amount: number; status: string } | null;
}

export interface DeliveryHistoryParams {
  period?: OrderHistoryPeriod;
  page?: number;
  limit?: number;
}

export interface DeliveryHistoryPage {
  items: HistoryDeliveryEntry[];
  total: number;
  page: number;
  limit: number;
}
