import type { InternalAxiosRequestConfig } from 'axios';
import { DELIVERY_ENDPOINTS } from '../endpoints/deliveryEndpoints';
import { USER_ENDPOINTS } from '../endpoints/userEndpoints';
import type { ApiDelivery } from '../mappers/deliveryMappers';
import {
  MOCK_DRIVER,
  MOCK_NOTIFICATIONS,
  MOCK_PAST_DELIVERIES,
  MOCK_SETTLEMENTS,
  MOCK_SHIFT_STATS,
  MOCK_TODAY,
  MOCK_TODAY_DELIVERIES,
  buildMockBilling,
  buildMockEmptyReturn,
  buildMockItem,
} from './mockData';
import type { MockSettlement } from './mockData';
import type {
  CompletedDeliveryDetail,
  ConfirmDeliveryRequest,
  ConfirmDeliveryResponse,
  CylinderQuantity,
  DeliveryHistoryPage,
  DeliverySummary,
  DriverInventory,
  GenerateQrRequest,
  GenerateQrResponse,
  HistoryDeliveryEntry,
  MeApiResponse,
  Notification,
  OutForDeliveryResponse,
  ReceiptItem,
  RequestOtpApiResponse,
  UpdateOrderItemsRequest,
  VerifyLocationResponse,
  VerifyOtpApiResponse,
} from '../../types';

export interface MockResult {
  status: number;
  data: unknown;
}

const ok = <T>(data: T): MockResult => ({ status: 200, data: { success: true, data } });

const matchId = (url: string, prefix: string, suffix = ''): string | null => {
  const pattern = new RegExp(`^${prefix}/([^/]+)${suffix}$`);
  const match = url.match(pattern);
  return match ? match[1] : null;
};

/** Axios hands interceptors a JSON string; devFallback passes the object itself. */
const readBody = <T>(config: InternalAxiosRequestConfig): T => {
  const body: unknown = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  return (body ?? {}) as T;
};

const nowAsClockTime = (): string =>
  new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

const sumQuantities = (items: Array<{ quantity: number }>): number =>
  items.reduce((total, item) => total + item.quantity, 0);

// ---- In-memory delivery state (per app session) ----
// Status changes, doorstep updates and confirm -> OTP -> receipt hang
// together like a real backend until the app restarts.

const mockDeliveries: ApiDelivery[] = MOCK_TODAY_DELIVERIES.map((delivery) => JSON.parse(JSON.stringify(delivery)));
const confirmations = new Map<string, ConfirmDeliveryRequest>();
const completedDetails = new Map<string, CompletedDeliveryDetail>();
/** Ids completed via verify-customer-otp this session, oldest first — they sort above the seeded completed ones. */
const completedThisSession: string[] = [];

/** Unknown ids throw like an unmapped route, so a live (non-mock) delivery's real error surfaces instead. */
const findDelivery = (id: string): ApiDelivery => {
  const delivery = mockDeliveries.find((item) => item.id === id) ?? MOCK_PAST_DELIVERIES.find((item) => item.id === id);
  if (!delivery) {
    throw new Error(`[mock] No mock delivery ${id}`);
  }
  return delivery;
};

/** update-items: lines re-priced from the catalog, each type keeps its previous empty due, billing recalculated. */
const applyItemUpdate = (delivery: ApiDelivery, updatedItems: CylinderQuantity[]): void => {
  const previousDue = new Map((delivery.emptyReturns ?? []).map((item) => [item.cylinderType, item.customerPreviousDue]));
  const lines = updatedItems.filter((item) => item.quantity > 0);
  delivery.items = lines.map((item) => buildMockItem(item.cylinderType, item.quantity));
  const empties = lines.map((item) =>
    buildMockEmptyReturn(item.cylinderType, item.quantity, previousDue.get(item.cylinderType) ?? 0),
  );
  // A type dropped from the order still owes its previous empties.
  previousDue.forEach((due, cylinderType) => {
    if (due > 0 && !lines.some((item) => item.cylinderType === cylinderType)) {
      empties.push(buildMockEmptyReturn(cylinderType, 0, due));
    }
  });
  delivery.emptyReturns = empties;
  delivery.billing = buildMockBilling(delivery.items, delivery.billing?.customerPreviousBalance ?? 0);
};

const toReceiptItems = (
  delivery: ApiDelivery,
  entries: CylinderQuantity[],
  source: 'items' | 'emptyReturns',
): ReceiptItem[] =>
  entries
    .filter((entry) => entry.quantity > 0)
    .map((entry) => ({
      cylinderType: entry.cylinderType,
      label: (delivery[source] ?? []).find((line) => line.cylinderType === entry.cylinderType)?.label ?? entry.cylinderType,
      quantity: entry.quantity,
    }));

/** verify-customer-otp: the receipt is built from what /confirm recorded (or the order as-is), and the delivery completes. */
const completeDelivery = (delivery: ApiDelivery): DeliverySummary => {
  const payable = delivery.billing?.totalPayableAmount ?? 0;
  const confirmation: ConfirmDeliveryRequest = confirmations.get(delivery.id) ?? {
    deliveredItems: delivery.items.map(({ cylinderType, quantity }) => ({ cylinderType, quantity })),
    collectedEmpties: (delivery.emptyReturns ?? []).map((item) => ({
      cylinderType: item.cylinderType,
      quantity: item.expectedQuantity,
    })),
    payment: { method: 'cash', split: 'full', amountCollected: payable, payableAmount: payable, pendingBalance: 0 },
  };
  const deliveredItems = toReceiptItems(delivery, confirmation.deliveredItems, 'items');
  const emptyCollectedItems = toReceiptItems(delivery, confirmation.collectedEmpties, 'emptyReturns');
  const expectedTotal = (delivery.emptyReturns ?? []).reduce((total, item) => total + item.expectedQuantity, 0);
  const collectedTotal = sumQuantities(emptyCollectedItems);
  const completedAt = nowAsClockTime();
  const { payment } = confirmation;

  delivery.status = 'completed';
  delivery.completedAt = completedAt;
  completedThisSession.push(delivery.id);
  completedDetails.set(delivery.id, {
    id: delivery.id,
    orderNumber: delivery.orderNumber,
    status: 'completed',
    deliveryDate: delivery.deliveryDate,
    completedAt,
    customer: delivery.customer,
    deliveredItems,
    emptyItems: emptyCollectedItems,
    payment: {
      method: payment.method,
      split: payment.split,
      totalAmount: payment.payableAmount,
      amountPaid: payment.amountCollected,
      pendingBalance: payment.pendingBalance,
    },
    driverNotes: confirmation.driverNotes,
  });

  return {
    deliveryId: delivery.id,
    orderNumber: delivery.orderNumber,
    status: 'completed',
    completedAt,
    totalDeliveredQuantity: sumQuantities(deliveredItems),
    deliveredItems,
    totalEmptyCollectedQuantity: collectedTotal,
    emptyCollectedItems,
    emptyDueSummary: {
      expectedTotal,
      collectedTotal,
      addedToCustomerPendingDue: Math.max(0, expectedTotal - collectedTotal),
    },
    payment: {
      method: payment.method,
      split: payment.split,
      totalBillAmount: payment.payableAmount,
      amountCollected: payment.amountCollected,
      pendingBalance: payment.pendingBalance,
    },
  };
};

/** completed-detail: a delivery finished this session, or one seeded as completed (settled per MOCK_SETTLEMENTS). */
const completedDetail = (id: string): CompletedDeliveryDetail => {
  const recorded = completedDetails.get(id);
  if (recorded) {
    return recorded;
  }
  const delivery = findDelivery(id);
  if (delivery.status === 'failed') {
    // Nothing changed hands on a failed delivery.
    return {
      id: delivery.id,
      orderNumber: delivery.orderNumber,
      status: 'failed',
      deliveryDate: delivery.deliveryDate,
      customer: delivery.customer,
      deliveredItems: [],
      emptyItems: [],
      payment: null,
      driverNotes: 'Customer unavailable — shop closed.',
    };
  }
  const totalAmount = delivery.billing?.totalPayableAmount ?? 0;
  const settlement: MockSettlement = MOCK_SETTLEMENTS[id] ?? { method: 'cash', split: 'full', amountPaid: totalAmount };
  return {
    id: delivery.id,
    orderNumber: delivery.orderNumber,
    status: 'completed',
    deliveryDate: delivery.deliveryDate,
    completedAt: delivery.completedAt ?? undefined,
    customer: delivery.customer,
    deliveredItems: delivery.items.map(({ cylinderType, label, quantity }) => ({ cylinderType, label, quantity })),
    emptyItems: (delivery.emptyReturns ?? []).map((item) => ({
      cylinderType: item.cylinderType,
      label: item.label,
      quantity:
        settlement.emptiesCollected?.[item.cylinderType as keyof MockSettlement['emptiesCollected']] ??
        item.expectedQuantity,
    })),
    payment: {
      method: settlement.method,
      split: settlement.split,
      totalAmount,
      amountPaid: settlement.amountPaid,
      pendingBalance: Math.max(0, totalAmount - settlement.amountPaid),
    },
    driverNotes: settlement.driverNotes,
  };
};

/** "4 × 19 KG, 2 × 47.5 KG" — the history row summary, as the server builds it. */
const itemsSummaryOf = (items: ReceiptItem[]): string =>
  items.map((item) => `${item.quantity} × ${item.label.replace(/\s+(Domestic|Commercial|Industrial)$/i, '')}`).join(', ');

const toHistoryEntry = (delivery: ApiDelivery): HistoryDeliveryEntry => {
  const detail = completedDetail(delivery.id);
  return {
    id: delivery.id,
    orderNumber: delivery.orderNumber,
    customerName: delivery.customer.name,
    status: detail.status,
    deliveryDate: delivery.deliveryDate,
    completedAt: detail.completedAt,
    totalDeliveredCount: sumQuantities(detail.deliveredItems),
    totalEmptiesCount: sumQuantities(detail.emptyItems),
    itemsSummary: itemsSummaryOf(detail.deliveredItems),
    payment: detail.payment
      ? {
          method: detail.payment.method,
          amount: detail.payment.amountPaid,
          status: detail.payment.pendingBalance > 0 ? 'PARTIAL' : 'FULL',
        }
      : null,
  };
};

const DAY_MS = 24 * 60 * 60_000;

/** GET /deliveries/history — today's finished deliveries (latest first), then MOCK_PAST_DELIVERIES, filtered by `period`. */
const historyPage = (config: InternalAxiosRequestConfig): DeliveryHistoryPage => {
  const query = new URLSearchParams((config.url ?? '').split('?')[1] ?? '');
  const params = (config.params ?? {}) as { period?: string; page?: number; limit?: number };
  const period = params.period ?? query.get('period') ?? 'all';
  const page = Number(params.page ?? query.get('page') ?? 1);
  const limit = Number(params.limit ?? query.get('limit') ?? 20);
  const recency = (id: string): number => {
    const sessionIndex = completedThisSession.indexOf(id);
    return sessionIndex >= 0 ? mockDeliveries.length + sessionIndex : mockDeliveries.findIndex((item) => item.id === id);
  };
  const finished = mockDeliveries
    .filter((delivery) => delivery.status === 'completed' || delivery.status === 'failed')
    .sort((a, b) => recency(b.id) - recency(a.id));
  const all = [...finished, ...MOCK_PAST_DELIVERIES].map(toHistoryEntry).filter((entry) => {
    const ageDays = entry.deliveryDate ? Math.round((Date.parse(MOCK_TODAY) - Date.parse(entry.deliveryDate)) / DAY_MS) : 0;
    return period === 'today' ? ageDays === 0 : period === 'week' ? ageDays < 7 : true;
  });
  return { items: all.slice((page - 1) * limit, page * limit), total: all.length, page, limit };
};

/**
 * Pattern-matches a request against every endpoint the app calls (see
 * src/api/endpoints/) and returns a realistic canned response in the
 * live API's wire shape. Throws for anything unmapped, so a missing mock
 * fails loudly and clearly instead of silently returning the wrong shape.
 */
export const resolveMockResponse = (config: InternalAxiosRequestConfig): MockResult => {
  const method = (config.method ?? 'get').toLowerCase();
  const url = (config.url ?? '').split('?')[0];

  // --- Auth ---
  // Deliberately NOT wrapped in the `ok()` {success,data} envelope —
  // confirmed via Swagger that the live delivery-auth API returns
  // these flat, snake_case, so the mock fallback matches what
  // authService.ts actually parses.
  if (method === 'post' && url === '/api/v1/delivery/auth/otp/request') {
    const body: RequestOtpApiResponse = {
      request_id: 'mock-request-id',
      message: 'OTP request accepted',
      expires_in: 300,
      resend_after: 30,
      code: 'OTP_REQUEST_ACCEPTED',
    };
    return { status: 202, data: body };
  }
  if (method === 'post' && url === '/api/v1/delivery/auth/otp/resend') {
    const body: RequestOtpApiResponse = {
      request_id: 'mock-request-id',
      message: 'OTP request accepted',
      expires_in: 300,
      resend_after: 30,
      code: 'OTP_REQUEST_ACCEPTED',
    };
    return { status: 202, data: body };
  }
  if (method === 'post' && url === '/api/v1/delivery/auth/otp/verify') {
    const body: VerifyOtpApiResponse = {
      token: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        token_type: 'Bearer',
        expires_in: 3600,
      },
      user_id: MOCK_DRIVER.id,
      role: 'DELIVERY',
      login_channel: 'DELIVERY',
      is_new_user: false,
      code: 'OTP_VERIFIED',
      message: 'OTP verified',
    };
    return { status: 200, data: body };
  }
  if (method === 'get' && url === '/api/v1/delivery/auth/me') {
    const body: MeApiResponse = {
      user_id: MOCK_DRIVER.id,
      login_channel: 'DELIVERY',
      user_type: 'DELIVERY_PARTNER',
      role: 'driver',
      account_status: 'ACTIVE',
      approval_status: 'APPROVED',
      next_action: 'OPEN_DELIVERY_HOME',
      merchant: null,
      delivery_profile: {
        full_name: MOCK_DRIVER.name,
        vehicle_number: MOCK_DRIVER.vehicleNumber,
        on_duty: MOCK_DRIVER.onDuty,
        avatar_initials: MOCK_DRIVER.avatarInitials,
        employee_code: 'MBGA-TEST-DRV-001',
        approval_status: 'APPROVED',
      },
      display_name: MOCK_DRIVER.name,
      mobile_number: MOCK_DRIVER.phone,
      country_code: '+91',
      effective_permissions: ['deliveries.update_status', 'deliveries.view', 'trips.view'],
    };
    return { status: 200, data: body };
  }
  if (method === 'post' && url === '/api/v1/delivery/auth/logout') {
    return { status: 200, data: { message: 'Logged out' } };
  }
  if (method === 'post' && url === '/api/v1/delivery/auth/logout-all') {
    return { status: 204, data: undefined };
  }

  // --- Deliveries — fixed paths first so e.g. ".../deliveries/history" never matches as an id.
  if (method === 'get' && url === DELIVERY_ENDPOINTS.TODAY) {
    return ok<ApiDelivery[]>(mockDeliveries);
  }
  if (method === 'get' && url === DELIVERY_ENDPOINTS.HISTORY) {
    return ok<DeliveryHistoryPage>(historyPage(config));
  }
  const outForDeliveryId = method === 'post' ? matchId(url, DELIVERY_ENDPOINTS.BASE, '/out-for-delivery') : null;
  if (outForDeliveryId) {
    const delivery = findDelivery(outForDeliveryId);
    delivery.status = 'out_for_delivery';
    return ok<OutForDeliveryResponse>({
      deliveryId: delivery.id,
      orderNumber: delivery.orderNumber,
      status: 'out_for_delivery',
      updatedAt: new Date().toISOString(),
    });
  }
  const verifyLocationId = method === 'post' ? matchId(url, DELIVERY_ENDPOINTS.BASE, '/verify-location') : null;
  if (verifyLocationId) {
    const delivery = findDelivery(verifyLocationId);
    const wasCaptured = Boolean(delivery.customer.isLocationCaptured);
    delivery.customer.isLocationCaptured = true;
    return ok<VerifyLocationResponse>({
      deliveryId: delivery.id,
      isAtLocation: true,
      distanceMetersFromDestination: 42,
      isLocationCaptured: true,
      message: wasCaptured ? 'Location verified successfully' : 'Customer location captured and locked',
    });
  }
  const updateItemsId = method === 'put' ? matchId(url, DELIVERY_ENDPOINTS.BASE, '/update-items') : null;
  if (updateItemsId) {
    const delivery = findDelivery(updateItemsId);
    applyItemUpdate(delivery, readBody<UpdateOrderItemsRequest>(config).updatedItems ?? []);
    return ok<ApiDelivery>(delivery);
  }
  const generateQrId = method === 'post' ? matchId(url, DELIVERY_ENDPOINTS.BASE, '/generate-qr') : null;
  if (generateQrId) {
    const delivery = findDelivery(generateQrId);
    const amount = Number(readBody<GenerateQrRequest>(config).amount ?? 0);
    return ok<GenerateQrResponse>({
      deliveryId: delivery.id,
      orderNumber: delivery.orderNumber,
      amount,
      upiString: `upi://pay?pa=mbga.mock@upi&pn=Madhav%20Bharat%20Gas&am=${amount.toFixed(2)}&tr=${delivery.orderNumber}&cu=INR`,
      // No image in mock mode — the QR card shows its placeholder glyph.
      qrImageUrl: '',
      expiresInSeconds: 600,
    });
  }
  const confirmId = method === 'post' ? matchId(url, DELIVERY_ENDPOINTS.BASE, '/confirm') : null;
  if (confirmId) {
    findDelivery(confirmId);
    confirmations.set(confirmId, readBody<ConfirmDeliveryRequest>(config));
    return ok<ConfirmDeliveryResponse>({
      deliveryId: confirmId,
      customerOtpRequired: true,
      otpChannel: 'IN_APP_NOTIFICATION',
      message: "OTP has been sent to customer's app notification",
    });
  }
  const otpDeliveryId = method === 'post' ? matchId(url, DELIVERY_ENDPOINTS.BASE, '/verify-customer-otp') : null;
  if (otpDeliveryId) {
    return ok<DeliverySummary>(completeDelivery(findDelivery(otpDeliveryId)));
  }
  const completedDetailId = method === 'get' ? matchId(url, DELIVERY_ENDPOINTS.BASE, '/completed-detail') : null;
  if (completedDetailId) {
    return ok<CompletedDeliveryDetail>(completedDetail(completedDetailId));
  }

  // --- Driver & notifications ---
  if (method === 'get' && url === USER_ENDPOINTS.PROFILE) {
    return ok({ ...MOCK_DRIVER, shiftStats: MOCK_SHIFT_STATS });
  }
  if (method === 'patch' && url === USER_ENDPOINTS.DRIVER_STATUS) {
    return ok({ onDuty: Boolean(readBody<{ onDuty?: boolean }>(config).onDuty) });
  }
  if (method === 'get' && url === USER_ENDPOINTS.INVENTORY) {
    return ok<DriverInventory>({
      totalFullCylinders: 24,
      totalEmptyCylinders: 6,
      activeDeliveriesCount: mockDeliveries.filter((delivery) => delivery.status === 'out_for_delivery').length,
      stockByType: [
        { cylinderType: '19_KG_COMMERCIAL', label: '19 KG Commercial', fullCount: 16, emptyCount: 4 },
        { cylinderType: '47.5_KG_INDUSTRIAL', label: '47.5 KG Industrial', fullCount: 6, emptyCount: 2 },
        { cylinderType: '5_KG_DOMESTIC', label: '5 KG Domestic', fullCount: 2, emptyCount: 0 },
      ],
    });
  }
  if (method === 'get' && url === USER_ENDPOINTS.UNREAD_COUNT) {
    return ok({ unreadCount: MOCK_NOTIFICATIONS.filter((notification) => !notification.isRead).length });
  }
  if (method === 'get' && url === USER_ENDPOINTS.NOTIFICATIONS) {
    return ok<Notification[]>(MOCK_NOTIFICATIONS);
  }
  if (method === 'post' && url === USER_ENDPOINTS.NOTIFICATIONS_READ_ALL) {
    return ok<null>(null);
  }
  const notificationReadId = method === 'patch' ? matchId(url, USER_ENDPOINTS.NOTIFICATIONS, '/read') : null;
  if (notificationReadId) {
    return ok<undefined>(undefined);
  }

  throw new Error(`[mock] No mock handler for ${method.toUpperCase()} ${url}`);
};
