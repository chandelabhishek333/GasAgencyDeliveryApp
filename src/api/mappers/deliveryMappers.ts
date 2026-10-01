import { emptyLabelFor } from '../../utils/cylinderSize';
import { formatRupees } from '../../utils/formatRupees';
import { PAYMENT_METHOD_LABEL, PAYMENT_SPLIT_LABEL } from '../../utils/paymentMeta';
import type { DeliveryPaymentCollection, Driver, Order, OrderItem, OrderStatus } from '../../types';

/**
 * Adapters between the live delivery API (OpenAPI: /openapi/delivery.json)
 * and the app's own types. The live API returns bare arrays/objects with
 * its own field names; the mocks return the app's shapes inside a
 * {success,data} envelope. Every mapper accepts both, so the dev mock
 * fallback keeps working unchanged.
 */

/** Strips the mocks' {success,data} envelope; live responses pass through as-is. */
export const unwrapResponse = <T>(body: unknown): T => {
  if (body && typeof body === 'object' && !Array.isArray(body) && 'success' in body && 'data' in body) {
    return (body as { data: T }).data;
  }
  return body as T;
};

// ---- Deliveries ----

/** DriverDeliveryResponse.items[] */
interface ApiDeliveryItem {
  cylinderType: string;
  label: string;
  quantity: number;
}

/** DriverDeliveryResponse — GET /deliveries, /deliveries/today, /deliveries/history, /deliveries/{id}. */
export interface ApiDelivery {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string | null;
  address: string;
  items: ApiDeliveryItem[];
  status: OrderStatus;
  scheduledDate: string;
  distanceKm: number | null;
  completedAt: string | null;
  emptiesCollected: number;
}

const isAppOrder = (raw: ApiDelivery | Order): raw is Order =>
  'timeSlotStart' in raw || raw.items.some((item) => 'kind' in item);

/**
 * Empties follow the 1-to-1 exchange rule: one empty back per full
 * cylinder, per type. Once a delivery is completed the API's actual
 * `emptiesCollected` total is known, so it's spread across the types in
 * order (each capped at its delivered quantity, any excess on the last).
 */
const emptyQuantities = (items: ApiDeliveryItem[], status: OrderStatus, emptiesCollected: number): number[] => {
  if (status !== 'completed') {
    return items.map((item) => item.quantity);
  }
  let remaining = emptiesCollected;
  return items.map((item, index) => {
    const quantity = index === items.length - 1 ? remaining : Math.min(item.quantity, remaining);
    remaining -= quantity;
    return Math.max(0, quantity);
  });
};

/** ISO datetime -> "11:20 AM" (the app's completedAt display format). Non-ISO values pass through. */
export const toClockTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${String(hours % 12 || 12).padStart(2, '0')}:${minutes} ${hours < 12 ? 'AM' : 'PM'}`;
};

export const toOrder = (raw: ApiDelivery | Order): Order => {
  if (isAppOrder(raw)) {
    return raw;
  }
  const empties = emptyQuantities(raw.items, raw.status, raw.emptiesCollected);
  const items: OrderItem[] = [
    ...raw.items.map((item, index) => ({
      id: `${raw.id}-cylinder-${index}`,
      kind: 'cylinderDelivery' as const,
      label: item.label,
      quantity: item.quantity,
    })),
    ...raw.items.map((item, index) => ({
      id: `${raw.id}-empty-${index}`,
      kind: 'emptyCollection' as const,
      label: emptyLabelFor(item.label),
      quantity: empties[index],
    })),
  ];
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    customerName: raw.customerName,
    customerPhone: raw.customerPhone ?? '',
    address: raw.address,
    // The live API has a delivery date only, no time window.
    timeSlotStart: '',
    timeSlotEnd: '',
    deliveryDate: raw.scheduledDate,
    status: raw.status,
    items,
    distanceKm: raw.distanceKm ?? undefined,
    completedAt: raw.completedAt ? toClockTime(raw.completedAt) : undefined,
  };
};

/** Bare array (live) or envelope/Paginated (mocks) -> Order[]. */
export const toOrders = (body: unknown): Order[] => {
  const data = unwrapResponse<unknown>(body);
  const list = Array.isArray(data) ? data : (data as { items?: unknown } | null)?.items;
  return Array.isArray(list) ? (list as Array<ApiDelivery | Order>).map(toOrder) : [];
};

// ---- Confirm Delivery ----

const NOTE_MAX_LENGTH = 500;

/**
 * The API has no payment fields yet, so the driver's collection is
 * preserved at the front of `note`:
 * "[Payment: Cash - Full ₹14,250] <driver notes>" or
 * "[Payment: Dynamic QR / UPI - Partial ₹5,000 of ₹14,250] …".
 * Capped at the API's 500-character limit.
 */
export const buildConfirmNote = (notes: string | undefined, payment: DeliveryPaymentCollection | undefined): string | null => {
  const split = payment ? PAYMENT_SPLIT_LABEL[payment.split].replace(' Payment', '') : '';
  const summary = payment
    ? `[Payment: ${PAYMENT_METHOD_LABEL[payment.method]} - ${split} ${formatRupees(payment.amount)}${
        payment.split === 'partial' ? ` of ${formatRupees(payment.payableAmount)}` : ''
      }]`
    : '';
  const note = [summary, notes?.trim()].filter(Boolean).join(' ');
  return note ? note.slice(0, NOTE_MAX_LENGTH) : null;
};

// ---- Driver ----

/** DriverProfileResponse — GET /driver/profile, PATCH /driver/status. */
interface ApiDriverProfile {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string | null;
  role: string;
  onDuty: boolean;
  avatarInitials: string | null;
}

export const toDriver = (body: unknown): Driver => {
  const raw = unwrapResponse<ApiDriverProfile | Driver>(body);
  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone,
    vehicleNumber: raw.vehicleNumber ?? '',
    role: raw.role,
    onDuty: raw.onDuty,
    avatarInitials: raw.avatarInitials ?? undefined,
  };
};

/** DriverInventoryResponse — GET /driver/inventory. */
export interface DriverInventory {
  fullCylinderCount: number;
  emptyCylinderCount: number;
  activeDeliveries: number;
}
