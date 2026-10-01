import { CYLINDER_CATALOG } from '../../constants/cylinderCatalog';
import { emptyLabelFor } from '../../utils/cylinderSize';
import type { ApiDelivery } from '../mappers/deliveryMappers';
import type {
  ApiPaymentMethod,
  CylinderType,
  DeliveryItemResponse,
  DeliveryPaymentSplit,
  Driver,
  EmptyReturnItem,
  Notification,
  ShiftStats,
} from '../../types';

/**
 * Canned data in the live API's wire shapes (docs/MBGA_Delivery_API_Specification.md
 * v3.0), so it goes through the same mappers as a live response.
 */

export const MOCK_DRIVER: Driver = {
  id: 'driver-1',
  name: 'Ravi Kumar',
  phone: '+91 98765 43210',
  vehicleNumber: 'UP14 AB 1234',
  role: 'Driver',
  onDuty: true,
  avatarInitials: 'RK',
};

export const MOCK_SHIFT_STATS: ShiftStats = {
  completedDeliveriesToday: 2,
  cashCollectedToday: 24250,
  totalEmptiesCollectedToday: 12,
};

const catalogEntry = (cylinderType: string) =>
  CYLINDER_CATALOG.find((entry) => entry.cylinderType === cylinderType) ?? {
    cylinderType,
    label: cylinderType,
    unitPrice: 0,
  };

export const buildMockItem = (cylinderType: string, quantity: number): DeliveryItemResponse => {
  const { label, unitPrice } = catalogEntry(cylinderType);
  return { cylinderType, label, quantity, unitPrice, totalPrice: unitPrice * quantity };
};

export const buildMockEmptyReturn = (
  cylinderType: string,
  currentOrderQuantity: number,
  customerPreviousDue = 0,
): EmptyReturnItem => ({
  cylinderType,
  label: emptyLabelFor(catalogEntry(cylinderType).label),
  currentOrderQuantity,
  customerPreviousDue,
  expectedQuantity: currentOrderQuantity + customerPreviousDue,
});

/** Billing for a set of lines: subtotal = Σ line totals, payable = subtotal + tax + previous balance. */
export const buildMockBilling = (items: DeliveryItemResponse[], customerPreviousBalance = 0): ApiDelivery['billing'] => {
  const orderSubtotal = items.reduce((total, item) => total + item.totalPrice, 0);
  return { orderSubtotal, taxAmount: 0, customerPreviousBalance, totalPayableAmount: orderSubtotal + customerPreviousBalance };
};

/**
 * Today's local date as ISO "YYYY-MM-DD" — computed, not frozen, so these
 * "today's deliveries" always match the dashboard's date badge.
 */
const toLocalIsoDate = (date: Date): string =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((part) => String(part).padStart(2, '0')).join('-');
const daysAgoDate = (n: number): string => toLocalIsoDate(new Date(Date.now() - n * 24 * 60 * 60_000));
export const MOCK_TODAY = toLocalIsoDate(new Date());

interface MockSeed {
  id: string;
  name: string;
  address: string;
  status: ApiDelivery['status'];
  distanceKm: number;
  /** [type, quantity, customer's previous empty due]. */
  lines: Array<[CylinderType, number, number?]>;
  previousBalance?: number;
  isLocationCaptured?: boolean;
  completedAt?: string;
  /** Defaults to today. */
  deliveryDate?: string;
}

let phoneSuffix = 10;
const buildDelivery = (seed: MockSeed): ApiDelivery => {
  const items = seed.lines.map(([type, quantity]) => buildMockItem(type, quantity));
  phoneSuffix += 1;
  return {
    id: seed.id,
    orderNumber: seed.id,
    status: seed.status,
    deliveryDate: seed.deliveryDate ?? MOCK_TODAY,
    customer: {
      id: `cust-${seed.id}`,
      name: seed.name,
      phone: `98765432${phoneSuffix}`,
      address: seed.address,
      latitude: 28.5921,
      longitude: 77.386,
      isLocationCaptured: seed.isLocationCaptured ?? true,
    },
    distanceKm: seed.distanceKm,
    items,
    emptyReturns: seed.lines.map(([type, quantity, due]) => buildMockEmptyReturn(type, quantity, due ?? 0)),
    billing: buildMockBilling(items, seed.previousBalance ?? 0),
    completedAt: seed.completedAt ?? null,
  };
};

/**
 * 12 deliveries matching the dashboard's "12 Orders / 8 Pending / 2 Out
 * for Delivery / 2 Completed" breakdown — Home's stats and Order List's
 * filter-tab counts are both derived from this same list.
 */
const TODAY_SEEDS: MockSeed[] = [
  { id: 'ORD1256', name: 'ABC Restaurant', address: 'Sector 61, Noida', status: 'pending', distanceKm: 1.8,
    lines: [['19_KG_COMMERCIAL', 5, 1], ['47.5_KG_INDUSTRIAL', 2]], previousBalance: 1500 },
  { id: 'ORD1257', name: 'Hotel Sunrise', address: 'Indirapuram, Ghaziabad', status: 'pending', distanceKm: 3.2,
    lines: [['19_KG_COMMERCIAL', 4, 1], ['47.5_KG_INDUSTRIAL', 2]], isLocationCaptured: false },
  { id: 'ORD1258', name: 'Green Mart', address: 'Sector 18, Noida', status: 'pending', distanceKm: 2.1,
    lines: [['19_KG_COMMERCIAL', 6]] },
  { id: 'ORD1259', name: 'City Bites', address: 'Sector 50, Noida', status: 'out_for_delivery', distanceKm: 0.9,
    lines: [['19_KG_COMMERCIAL', 3]] },
  { id: 'ORD1260', name: 'Metro Hotel', address: 'Sector 63, Noida', status: 'pending', distanceKm: 4.5,
    lines: [['19_KG_COMMERCIAL', 8, 2]] },
  { id: 'ORD1261', name: 'Green Valley Restaurant', address: 'Sector 15, Noida', status: 'pending', distanceKm: 2.7,
    lines: [['19_KG_COMMERCIAL', 5]] },
  { id: 'ORD1262', name: 'Sunshine Bakery', address: 'Sector 76, Noida', status: 'pending', distanceKm: 5.3,
    lines: [['14.2_KG_DOMESTIC', 3]], isLocationCaptured: false },
  { id: 'ORD1263', name: 'Royal Kitchen', address: 'Sector 44, Noida', status: 'out_for_delivery', distanceKm: 1.4,
    lines: [['19_KG_COMMERCIAL', 6]] },
  { id: 'ORD1264', name: 'Cafe Mocha', address: 'Sector 137, Noida', status: 'pending', distanceKm: 6.1,
    lines: [['5_KG_DOMESTIC', 4]] },
  { id: 'ORD1265', name: 'Spice Junction', address: 'Sector 62, Noida', status: 'pending', distanceKm: 2.9,
    lines: [['19_KG_COMMERCIAL', 3], ['35_KG_INDUSTRIAL', 2]] },
  { id: 'ORD1253', name: 'Food Plaza', address: 'Sector 18, Noida', status: 'completed', distanceKm: 2.0,
    lines: [['19_KG_COMMERCIAL', 5]], completedAt: '10:15 AM' },
  { id: 'ORD1254', name: 'The Grand Hotel', address: 'Sector 50, Noida', status: 'completed', distanceKm: 1.2,
    lines: [['19_KG_COMMERCIAL', 4], ['47.5_KG_INDUSTRIAL', 1]], completedAt: '11:20 AM' },
];

export const MOCK_TODAY_DELIVERIES: ApiDelivery[] = TODAY_SEEDS.map(buildDelivery);

/** How each already-completed mock delivery was settled — feeds completed-detail and history. */
export interface MockSettlement {
  method: ApiPaymentMethod;
  split: DeliveryPaymentSplit;
  amountPaid: number;
  /** Empties collected per type; types left out were collected in full. */
  emptiesCollected?: Partial<Record<CylinderType, number>>;
  driverNotes?: string;
}

export const MOCK_SETTLEMENTS: Record<string, MockSettlement> = {
  ORD1253: { method: 'cash', split: 'full', amountPaid: 9000 },
  ORD1252: { method: 'upi_qr', split: 'full', amountPaid: 9000 },
  ORD1251: {
    method: 'cash',
    split: 'partial',
    amountPaid: 8000,
    emptiesCollected: { '19_KG_COMMERCIAL': 2, '47.5_KG_INDUSTRIAL': 2 },
  },
  ORD1254: {
    method: 'upi_qr',
    split: 'partial',
    amountPaid: 10000,
    emptiesCollected: { '19_KG_COMMERCIAL': 3 },
    driverNotes: '1 empty 19 KG pending for next delivery.',
  },
};

/** Older finished deliveries — only seen in Delivery History (and their Completed Order Details). */
export const MOCK_PAST_DELIVERIES: ApiDelivery[] = (
  [
    { id: 'ORD1252', name: 'City Mart', address: 'Sector 16, Noida', status: 'completed', distanceKm: 1.6,
      lines: [['19_KG_COMMERCIAL', 5]], completedAt: '09:30 AM', deliveryDate: daysAgoDate(1) },
    { id: 'ORD1251', name: 'Hotel Crown', address: 'Sector 12, Noida', status: 'completed', distanceKm: 2.4,
      lines: [['19_KG_COMMERCIAL', 4], ['47.5_KG_INDUSTRIAL', 2]], completedAt: '08:45 AM', deliveryDate: daysAgoDate(3) },
    { id: 'ORD1240', name: 'Shree Caterers', address: 'Sector 22, Noida', status: 'failed', distanceKm: 3.0,
      lines: [['19_KG_COMMERCIAL', 3]], deliveryDate: daysAgoDate(12) },
  ] as MockSeed[]
).map(buildDelivery);

const minutesAgo = (n: number): string => new Date(Date.now() - n * 60_000).toISOString();
const hoursAgo = (n: number): string => new Date(Date.now() - n * 60 * 60_000).toISOString();
const daysAgo = (n: number): string => new Date(Date.now() - n * 24 * 60 * 60_000).toISOString();

/** Timestamps are computed relative to "now" (not frozen strings) so formatRelativeTime always reads naturally, whenever the app is opened. */
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'new_delivery',
    title: 'New Delivery Assigned',
    subtitle: '#ORD1260 - Metro Hotel',
    createdAt: minutesAgo(2),
    isRead: false,
  },
  {
    id: 'notif-2',
    type: 'delivery_confirmed',
    title: 'Delivery Confirmed',
    subtitle: '#ORD1254',
    createdAt: hoursAgo(1),
    isRead: true,
  },
  {
    id: 'notif-3',
    type: 'order_updated',
    title: 'Order Updated',
    subtitle: '#ORD1253 - Out for Delivery',
    createdAt: hoursAgo(2),
    isRead: true,
  },
  {
    id: 'notif-4',
    type: 'new_delivery',
    title: 'New Delivery Assigned',
    subtitle: '#ORD1261 - Green Mart',
    createdAt: hoursAgo(3),
    isRead: false,
  },
  {
    id: 'notif-5',
    type: 'system',
    title: 'System Notice',
    subtitle: 'App updated successfully',
    createdAt: daysAgo(1),
    isRead: true,
  },
];
