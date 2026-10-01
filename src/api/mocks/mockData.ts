import type { Delivery, Driver, Notification, Order, OrderItem } from '../../types';

export const MOCK_DRIVER: Driver = {
  id: 'driver-1',
  name: 'Ravi Kumar',
  phone: '+91 98765 43210',
  vehicleNumber: 'UP14 AB 1234',
  role: 'Driver',
  onDuty: true,
  avatarInitials: 'RK',
};

const buildItems = (id: string, quantity: number): OrderItem[] => [
  { id: `${id}-cylinder`, kind: 'cylinderDelivery', label: '19 KG Cylinder', quantity },
  { id: `${id}-empty`, kind: 'emptyCollection', label: '19 KG Empty', quantity },
];

/** Mixed-size order (19 KG + 47.5 KG) — exercises Order Detail's multi-cylinder layout. */
const buildMixedItems = (id: string, commercial: number, industrial: number): OrderItem[] => [
  { id: `${id}-cylinder-19`, kind: 'cylinderDelivery', label: '19 KG Commercial', quantity: commercial },
  { id: `${id}-cylinder-47`, kind: 'cylinderDelivery', label: '47.5 KG Industrial', quantity: industrial },
  { id: `${id}-empty-19`, kind: 'emptyCollection', label: '19 KG Empty', quantity: commercial },
  { id: `${id}-empty-47`, kind: 'emptyCollection', label: '47.5 KG Empty', quantity: industrial },
];

/**
 * Today's local date as ISO "YYYY-MM-DD" (the API's format) — computed,
 * not frozen, so these "today's deliveries" always match the dashboard's
 * date badge, whenever the app is opened.
 */
const toLocalIsoDate = (date: Date): string =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((part) => String(part).padStart(2, '0')).join('-');
const MOCK_DELIVERY_DATE = toLocalIsoDate(new Date());

/**
 * 12 orders matching the dashboard's "12 Orders / 8 Pending / 2 In
 * Progress / 2 Completed" breakdown exactly — Home's stats and Order
 * List's filter-tab counts are both derived from this same list, so
 * keeping it consistent here keeps the whole app consistent.
 */
export const MOCK_TODAY_DELIVERIES: Delivery[] = [
  {
    id: 'ORD1256',
    orderNumber: 'ORD1256',
    customerName: 'ABC Restaurant',
    customerPhone: '+91 98765 43210',
    address: 'Sector 61, Noida',
    timeSlotStart: '10:50 AM',
    timeSlotEnd: '12:00 PM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'pending',
    distanceKm: 1.8,
    items: buildMixedItems('ORD1256', 5, 2),
  },
  {
    id: 'ORD1257',
    orderNumber: 'ORD1257',
    customerName: 'Hotel Sunrise',
    customerPhone: '+91 98765 43211',
    address: 'Indirapuram, Ghaziabad',
    timeSlotStart: '10:30 AM',
    timeSlotEnd: '12:30 PM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'pending',
    distanceKm: 3.2,
    items: buildMixedItems('ORD1257', 4, 2),
  },
  {
    id: 'ORD1258',
    orderNumber: 'ORD1258',
    customerName: 'Green Mart',
    customerPhone: '+91 98765 43212',
    address: 'Sector 18, Noida',
    timeSlotStart: '12:00 PM',
    timeSlotEnd: '1:00 PM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'pending',
    distanceKm: 2.1,
    items: buildItems('ORD1258', 6),
  },
  {
    id: 'ORD1259',
    orderNumber: 'ORD1259',
    customerName: 'City Bites',
    customerPhone: '+91 98765 43213',
    address: 'Sector 50, Noida',
    timeSlotStart: '09:00 AM',
    timeSlotEnd: '10:00 AM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'in_progress',
    distanceKm: 0.9,
    items: buildItems('ORD1259', 3),
  },
  {
    id: 'ORD1260',
    orderNumber: 'ORD1260',
    customerName: 'Metro Hotel',
    customerPhone: '+91 98765 43214',
    address: 'Sector 63, Noida',
    timeSlotStart: '1:00 PM',
    timeSlotEnd: '2:00 PM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'pending',
    distanceKm: 4.5,
    items: buildItems('ORD1260', 8),
  },
  {
    id: 'ORD1261',
    orderNumber: 'ORD1261',
    customerName: 'Green Valley Restaurant',
    customerPhone: '+91 98765 43215',
    address: 'Sector 15, Noida',
    timeSlotStart: '2:00 PM',
    timeSlotEnd: '3:00 PM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'pending',
    distanceKm: 2.7,
    items: buildItems('ORD1261', 5),
  },
  {
    id: 'ORD1262',
    orderNumber: 'ORD1262',
    customerName: 'Sunshine Bakery',
    customerPhone: '+91 98765 43216',
    address: 'Sector 76, Noida',
    timeSlotStart: '3:00 PM',
    timeSlotEnd: '4:00 PM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'pending',
    distanceKm: 5.3,
    items: buildItems('ORD1262', 3),
  },
  {
    id: 'ORD1263',
    orderNumber: 'ORD1263',
    customerName: 'Royal Kitchen',
    customerPhone: '+91 98765 43217',
    address: 'Sector 44, Noida',
    timeSlotStart: '11:00 AM',
    timeSlotEnd: '12:00 PM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'in_progress',
    distanceKm: 1.4,
    items: buildItems('ORD1263', 6),
  },
  {
    id: 'ORD1264',
    orderNumber: 'ORD1264',
    customerName: 'Cafe Mocha',
    customerPhone: '+91 98765 43218',
    address: 'Sector 137, Noida',
    timeSlotStart: '4:00 PM',
    timeSlotEnd: '5:00 PM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'pending',
    distanceKm: 6.1,
    items: buildItems('ORD1264', 4),
  },
  {
    id: 'ORD1265',
    orderNumber: 'ORD1265',
    customerName: 'Spice Junction',
    customerPhone: '+91 98765 43219',
    address: 'Sector 62, Noida',
    timeSlotStart: '5:00 PM',
    timeSlotEnd: '6:00 PM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'pending',
    distanceKm: 2.9,
    items: buildMixedItems('ORD1265', 3, 2),
  },
  {
    id: 'ORD1253',
    orderNumber: 'ORD1253',
    customerName: 'Food Plaza',
    customerPhone: '+91 98765 43220',
    address: 'Sector 18, Noida',
    timeSlotStart: '09:00 AM',
    timeSlotEnd: '10:00 AM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'completed',
    distanceKm: 2.0,
    items: buildItems('ORD1253', 5),
    completedAt: '10:15 AM',
    payment: { method: 'cash', split: 'full', amount: 14250, payableAmount: 14250 },
  },
  {
    id: 'ORD1254',
    orderNumber: 'ORD1254',
    customerName: 'The Grand Hotel',
    customerPhone: '+91 98765 43221',
    address: 'Sector 50, Noida',
    timeSlotStart: '10:00 AM',
    timeSlotEnd: '11:00 AM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'completed',
    distanceKm: 1.2,
    items: buildItems('ORD1254', 7),
    completedAt: '11:20 AM',
    payment: { method: 'upiQr', split: 'partial', amount: 10000, payableAmount: 14250 },
  },
];

/** Delivery History — today's 4 completed deliveries, newest first (matches Screen 11). */
export const MOCK_ORDER_HISTORY: Order[] = [
  MOCK_TODAY_DELIVERIES.find((order) => order.id === 'ORD1254')!,
  MOCK_TODAY_DELIVERIES.find((order) => order.id === 'ORD1253')!,
  {
    id: 'ORD1252',
    orderNumber: 'ORD1252',
    customerName: 'City Mart',
    customerPhone: '+91 98765 43222',
    address: 'Sector 16, Noida',
    timeSlotStart: '08:30 AM',
    timeSlotEnd: '09:30 AM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'completed',
    distanceKm: 1.6,
    items: buildItems('ORD1252', 5),
    completedAt: '09:30 AM',
    payment: { method: 'upiQr', split: 'full', amount: 14250, payableAmount: 14250 },
  },
  {
    id: 'ORD1251',
    orderNumber: 'ORD1251',
    customerName: 'Hotel Crown',
    customerPhone: '+91 98765 43223',
    address: 'Sector 12, Noida',
    timeSlotStart: '08:00 AM',
    timeSlotEnd: '09:00 AM',
    deliveryDate: MOCK_DELIVERY_DATE,
    status: 'completed',
    distanceKm: 2.4,
    items: buildItems('ORD1251', 5),
    completedAt: '08:45 AM',
    payment: { method: 'cash', split: 'partial', amount: 8000, payableAmount: 14250 },
  },
];

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
