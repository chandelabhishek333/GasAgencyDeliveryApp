import { toApiPaymentMethod } from '../../utils/paymentMeta';
import type {
  BillingSummary,
  CompletedDeliveryDetail,
  ConfirmDeliveryResponse,
  CustomerInfo,
  DeliveryHistoryPage,
  DeliveryItemResponse,
  DeliverySummary,
  Driver,
  DriverInventory,
  DutyStatusResponse,
  EmptyReturnItem,
  GenerateQrResponse,
  HistoryDeliveryEntry,
  Order,
  OrderItem,
  OrderStatus,
  OutForDeliveryResponse,
  ReceiptItem,
  ShiftStats,
  VerifyLocationResponse,
} from '../../types';

/**
 * Adapters between the live delivery API (docs/MBGA_Delivery_API_Specification.md
 * v3.0) and the app's own types. The mocks in src/api/mocks/ return the same
 * wire shapes, so live and dev-fallback responses both pass through here.
 */

/** Strips a {success,data} envelope; bare responses pass through as-is. */
export const unwrapResponse = <T>(body: unknown): T => {
  if (body && typeof body === 'object' && !Array.isArray(body) && 'success' in body && 'data' in body) {
    return (body as { data: T }).data;
  }
  return body as T;
};

const asArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

/** Money and counts may arrive as numbers or (Decimal-serialised) strings like "16100.00". */
const toNumber = (value: unknown, fallback = 0): number => {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  return typeof number === 'number' && Number.isFinite(number) ? number : fallback;
};

const sumQuantities = (items: Array<{ quantity: number }>): number =>
  items.reduce((total, item) => total + item.quantity, 0);

/** `in_progress` was the status's name before the v3 API; anything else passes through lower-cased. */
export const toOrderStatus = (value: string): OrderStatus => {
  const status = value.toLowerCase();
  return (status === 'in_progress' ? 'out_for_delivery' : status) as OrderStatus;
};

/** ISO datetime -> "11:20 AM" (the app's completedAt display format). Non-ISO values like "04:28 PM" pass through. */
export const toClockTime = (value: string): string => {
  const date = new Date(value);
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value) || Number.isNaN(date.getTime())) {
    return value;
  }
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${String(hours % 12 || 12).padStart(2, '0')}:${minutes} ${hours < 12 ? 'AM' : 'PM'}`;
};

const toOptionalClockTime = (value: string | null | undefined): string | undefined =>
  value ? toClockTime(value) : undefined;

// ---- Deliveries ----

/** One delivery as GET /deliveries/today (and PUT update-items) returns it. */
export interface ApiDelivery {
  id: string;
  orderNumber: string;
  status: string;
  deliveryDate?: string;
  customer: CustomerInfo;
  distanceKm?: number | null;
  items: DeliveryItemResponse[];
  emptyReturns?: EmptyReturnItem[];
  billing?: BillingSummary;
  completedAt?: string | null;
}

const toCustomer = (raw: Partial<CustomerInfo> | undefined): CustomerInfo => ({
  id: raw?.id,
  name: raw?.name ?? '',
  phone: raw?.phone ?? '',
  address: raw?.address ?? '',
  latitude: raw?.latitude == null ? undefined : toNumber(raw.latitude),
  longitude: raw?.longitude == null ? undefined : toNumber(raw.longitude),
  isLocationCaptured: raw?.isLocationCaptured ?? false,
});

/** Billing as sent; if the server leaves it out, the line totals are the whole bill. */
const toBilling = (raw: Partial<BillingSummary> | undefined, items: OrderItem[]): BillingSummary => {
  const lineTotal = items.reduce((total, item) => total + (item.totalPrice ?? 0), 0);
  const orderSubtotal = toNumber(raw?.orderSubtotal, lineTotal);
  return {
    orderSubtotal,
    taxAmount: toNumber(raw?.taxAmount),
    customerPreviousBalance: toNumber(raw?.customerPreviousBalance),
    totalPayableAmount: toNumber(raw?.totalPayableAmount, orderSubtotal),
  };
};

/**
 * The app's flat line list: one `cylinderDelivery` line per `items[]`
 * entry and one `emptyCollection` line per `emptyReturns[]` entry. Line
 * ids are keyed by cylinderType, so they survive an update-items
 * round-trip and Confirm Delivery's per-line draft quantities still match.
 */
export const toOrder = (raw: ApiDelivery): Order => {
  const delivered: OrderItem[] = asArray<DeliveryItemResponse>(raw.items).map((item) => ({
    id: `${raw.id}-cylinder-${item.cylinderType}`,
    kind: 'cylinderDelivery',
    cylinderType: item.cylinderType,
    label: item.label,
    quantity: toNumber(item.quantity),
    unitPrice: toNumber(item.unitPrice),
    totalPrice: toNumber(item.totalPrice),
  }));
  const empties: OrderItem[] = asArray<EmptyReturnItem>(raw.emptyReturns).map((item) => ({
    id: `${raw.id}-empty-${item.cylinderType}`,
    kind: 'emptyCollection',
    cylinderType: item.cylinderType,
    label: item.label,
    quantity: toNumber(item.expectedQuantity),
    currentOrderQuantity: toNumber(item.currentOrderQuantity),
    customerPreviousDue: toNumber(item.customerPreviousDue),
  }));
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    status: toOrderStatus(raw.status),
    deliveryDate: raw.deliveryDate,
    customer: toCustomer(raw.customer),
    distanceKm: raw.distanceKm == null ? undefined : toNumber(raw.distanceKm),
    items: [...delivered, ...empties],
    billing: toBilling(raw.billing, delivered),
    completedAt: toOptionalClockTime(raw.completedAt),
  };
};

/** A delivery list — a bare array or a paged {items} object, with or without the envelope. */
export const toOrders = (body: unknown): Order[] => {
  const data = unwrapResponse<unknown>(body);
  const list = Array.isArray(data) ? data : (data as { items?: unknown } | null)?.items;
  return asArray<ApiDelivery>(list).map(toOrder);
};

/** A single delivery (the update-items response). */
export const toSingleOrder = (body: unknown): Order => toOrder(unwrapResponse<ApiDelivery>(body));

export const toOutForDelivery = (body: unknown): OutForDeliveryResponse => {
  const raw = unwrapResponse<OutForDeliveryResponse>(body);
  return { ...raw, status: toOrderStatus(raw.status ?? 'out_for_delivery') };
};

export const toVerifyLocation = (body: unknown): VerifyLocationResponse => {
  const raw = unwrapResponse<VerifyLocationResponse>(body);
  return {
    deliveryId: raw.deliveryId,
    isAtLocation: Boolean(raw.isAtLocation),
    distanceMetersFromDestination: toNumber(raw.distanceMetersFromDestination),
    isLocationCaptured: Boolean(raw.isLocationCaptured),
    message: raw.message,
  };
};

export const toGenerateQr = (body: unknown): GenerateQrResponse => {
  const raw = unwrapResponse<GenerateQrResponse>(body);
  return {
    deliveryId: raw.deliveryId,
    orderNumber: raw.orderNumber,
    amount: toNumber(raw.amount),
    upiString: raw.upiString ?? '',
    qrImageUrl: raw.qrImageUrl ?? '',
    expiresInSeconds: toNumber(raw.expiresInSeconds),
  };
};

export const toConfirmResponse = (body: unknown): ConfirmDeliveryResponse => {
  const raw = unwrapResponse<ConfirmDeliveryResponse>(body);
  return { ...raw, customerOtpRequired: raw.customerOtpRequired !== false };
};

const toReceiptItems = (value: unknown): ReceiptItem[] =>
  asArray<ReceiptItem>(value).map((item) => ({
    cylinderType: item.cylinderType,
    label: item.label,
    quantity: toNumber(item.quantity),
  }));

/** POST verify-customer-otp -> the Delivery Completed receipt. Totals are summed from the lines if missing. */
export const toDeliverySummary = (body: unknown): DeliverySummary => {
  const raw = unwrapResponse<DeliverySummary>(body);
  const deliveredItems = toReceiptItems(raw.deliveredItems);
  const emptyCollectedItems = toReceiptItems(raw.emptyCollectedItems);
  const totalEmptyCollectedQuantity = toNumber(raw.totalEmptyCollectedQuantity, sumQuantities(emptyCollectedItems));
  const totalBillAmount = toNumber(raw.payment?.totalBillAmount);
  const amountCollected = toNumber(raw.payment?.amountCollected);
  return {
    deliveryId: raw.deliveryId,
    orderNumber: raw.orderNumber,
    status: toOrderStatus(raw.status ?? 'completed'),
    completedAt: toClockTime(raw.completedAt ?? ''),
    totalDeliveredQuantity: toNumber(raw.totalDeliveredQuantity, sumQuantities(deliveredItems)),
    deliveredItems,
    totalEmptyCollectedQuantity,
    emptyCollectedItems,
    emptyDueSummary: {
      expectedTotal: toNumber(raw.emptyDueSummary?.expectedTotal, totalEmptyCollectedQuantity),
      collectedTotal: toNumber(raw.emptyDueSummary?.collectedTotal, totalEmptyCollectedQuantity),
      addedToCustomerPendingDue: toNumber(raw.emptyDueSummary?.addedToCustomerPendingDue),
    },
    payment: {
      method: toApiPaymentMethod(raw.payment?.method ?? 'cash'),
      split: raw.payment?.split ?? 'full',
      totalBillAmount,
      amountCollected,
      pendingBalance: toNumber(raw.payment?.pendingBalance, Math.max(0, totalBillAmount - amountCollected)),
    },
  };
};

export const toCompletedDetail = (body: unknown): CompletedDeliveryDetail => {
  const raw = unwrapResponse<CompletedDeliveryDetail>(body);
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    status: toOrderStatus(raw.status ?? 'completed'),
    deliveryDate: raw.deliveryDate,
    completedAt: toOptionalClockTime(raw.completedAt),
    customer: toCustomer(raw.customer),
    deliveredItems: toReceiptItems(raw.deliveredItems),
    emptyItems: toReceiptItems(raw.emptyItems),
    payment: raw.payment
      ? {
          method: toApiPaymentMethod(raw.payment.method),
          split: raw.payment.split,
          totalAmount: toNumber(raw.payment.totalAmount),
          amountPaid: toNumber(raw.payment.amountPaid),
          pendingBalance: toNumber(raw.payment.pendingBalance),
        }
      : null,
    driverNotes: raw.driverNotes ?? undefined,
  };
};

const toHistoryEntry = (raw: HistoryDeliveryEntry): HistoryDeliveryEntry => ({
  id: raw.id,
  orderNumber: raw.orderNumber,
  customerName: raw.customerName,
  status: toOrderStatus(raw.status),
  deliveryDate: raw.deliveryDate,
  completedAt: toOptionalClockTime(raw.completedAt),
  totalDeliveredCount: toNumber(raw.totalDeliveredCount),
  totalEmptiesCount: toNumber(raw.totalEmptiesCount),
  itemsSummary: raw.itemsSummary ?? '',
  payment: raw.payment
    ? { method: toApiPaymentMethod(raw.payment.method), amount: toNumber(raw.payment.amount), status: raw.payment.status }
    : null,
});

/** GET /deliveries/history -> one page. A bare array is treated as a single page. */
export const toHistoryPage = (body: unknown): DeliveryHistoryPage => {
  const data = unwrapResponse<Partial<DeliveryHistoryPage> | HistoryDeliveryEntry[]>(body);
  if (Array.isArray(data)) {
    return { items: data.map(toHistoryEntry), total: data.length, page: 1, limit: data.length };
  }
  const items = asArray<HistoryDeliveryEntry>(data?.items).map(toHistoryEntry);
  return {
    items,
    total: toNumber(data?.total, items.length),
    page: toNumber(data?.page, 1),
    limit: toNumber(data?.limit, items.length),
  };
};

// ---- Driver ----

/** GET /driver/profile. */
interface ApiDriverProfile {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string | null;
  role: string;
  onDuty: boolean;
  avatarInitials: string | null;
  shiftStats?: ShiftStats | null;
}

export const toDriver = (body: unknown): Driver => {
  const raw = unwrapResponse<ApiDriverProfile>(body);
  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone,
    vehicleNumber: raw.vehicleNumber ?? '',
    role: raw.role,
    onDuty: raw.onDuty,
    avatarInitials: raw.avatarInitials ?? undefined,
    shiftStats: raw.shiftStats
      ? {
          completedDeliveriesToday: toNumber(raw.shiftStats.completedDeliveriesToday),
          cashCollectedToday: toNumber(raw.shiftStats.cashCollectedToday),
          totalEmptiesCollectedToday: toNumber(raw.shiftStats.totalEmptiesCollectedToday),
        }
      : undefined,
  };
};

export const toDutyStatus = (body: unknown): DutyStatusResponse => ({
  onDuty: Boolean(unwrapResponse<Partial<DutyStatusResponse>>(body)?.onDuty),
});

/**
 * GET /driver/inventory. The pre-v3 field names (fullCylinderCount,
 * emptyCylinderCount, activeDeliveries — live until at least 2026-09-29)
 * are still read as a fallback.
 */
export const toInventory = (body: unknown): DriverInventory => {
  const raw = unwrapResponse<
    Partial<DriverInventory> & { fullCylinderCount?: number; emptyCylinderCount?: number; activeDeliveries?: number }
  >(body);
  return {
    totalFullCylinders: toNumber(raw.totalFullCylinders ?? raw.fullCylinderCount),
    totalEmptyCylinders: toNumber(raw.totalEmptyCylinders ?? raw.emptyCylinderCount),
    activeDeliveriesCount: toNumber(raw.activeDeliveriesCount ?? raw.activeDeliveries),
    stockByType: asArray<DriverInventory['stockByType'][number]>(raw.stockByType).map((stock) => ({
      cylinderType: stock.cylinderType,
      label: stock.label,
      fullCount: toNumber(stock.fullCount),
      emptyCount: toNumber(stock.emptyCount),
    })),
  };
};

/** GET /notifications/unread-count — `{ unreadCount }` (v3) or `{ unread }` (pre-v3). */
export const toUnreadCount = (body: unknown): number => {
  const raw = unwrapResponse<{ unreadCount?: number; unread?: number }>(body);
  return toNumber(raw?.unreadCount ?? raw?.unread);
};
