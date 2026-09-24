import type { InternalAxiosRequestConfig } from 'axios';
import { MOCK_DRIVER, MOCK_NOTIFICATIONS, MOCK_ORDER_HISTORY, MOCK_TODAY_DELIVERIES } from './mockData';
import type {
  Delivery,
  DeliveryConfirmResponse,
  DeliveryStartResponse,
  DeliverySummary,
  Driver,
  MeApiResponse,
  Notification,
  Order,
  Paginated,
  RequestOtpApiResponse,
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

const nowAsClockTime = (): string =>
  new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

/**
 * Pattern-matches a request against every endpoint the 13 screens
 * actually call (see src/api/endpoints/) and returns a realistic
 * canned response in the same ApiSuccessResponse envelope the real
 * API uses. Throws for anything unmapped, so a missing mock fails
 * loudly and clearly instead of silently returning the wrong shape.
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
      next_action: 'OPEN_DELIVERY_HOME',
      merchant: null,
      delivery_profile: {
        full_name: MOCK_DRIVER.name,
        vehicle_number: MOCK_DRIVER.vehicleNumber,
        on_duty: MOCK_DRIVER.onDuty,
        avatar_initials: MOCK_DRIVER.avatarInitials,
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

  // --- Deliveries (checked most-specific-first so e.g. "/deliveries/today" never matches the dynamic :id patterns below) ---
  if (method === 'get' && url === '/deliveries/today') {
    return ok<Delivery[]>(MOCK_TODAY_DELIVERIES);
  }
  const startId = method === 'post' ? matchId(url, '/deliveries', '/start') : null;
  if (startId) {
    return ok<DeliveryStartResponse>({ isAtLocation: true, distanceMetersFromDestination: 42 });
  }
  const confirmId = method === 'post' ? matchId(url, '/deliveries', '/confirm') : null;
  if (confirmId) {
    return ok<DeliveryConfirmResponse>({ deliveryId: confirmId, customerOtpRequired: true });
  }
  const otpDeliveryId = method === 'post' ? matchId(url, '/deliveries', '/verify-customer-otp') : null;
  if (otpDeliveryId) {
    const delivery = MOCK_TODAY_DELIVERIES.find((item) => item.id === otpDeliveryId);
    const cylinder = delivery?.items.find((item) => item.kind === 'cylinderDelivery');
    const empty = delivery?.items.find((item) => item.kind === 'emptyCollection');
    return ok<DeliverySummary>({
      deliveryId: otpDeliveryId,
      orderNumber: delivery?.orderNumber ?? otpDeliveryId,
      deliveredQuantity: cylinder?.quantity ?? 5,
      emptyCollectedQuantity: empty?.quantity ?? 5,
      completedAt: nowAsClockTime(),
    });
  }
  const deliveryDetailId = method === 'get' ? matchId(url, '/deliveries') : null;
  if (deliveryDetailId) {
    const delivery = MOCK_TODAY_DELIVERIES.find((item) => item.id === deliveryDetailId);
    if (delivery) {
      return ok<Delivery>(delivery);
    }
  }

  // --- Orders ---
  if (method === 'get' && url === '/orders/history') {
    return ok<Paginated<Order>>({
      items: MOCK_ORDER_HISTORY,
      page: 1,
      totalPages: 1,
      totalItems: MOCK_ORDER_HISTORY.length,
    });
  }
  if (method === 'get' && url === '/orders') {
    return ok<Paginated<Order>>({
      items: MOCK_TODAY_DELIVERIES,
      page: 1,
      totalPages: 1,
      totalItems: MOCK_TODAY_DELIVERIES.length,
    });
  }
  const orderDetailId = method === 'get' ? matchId(url, '/orders') : null;
  if (orderDetailId) {
    const order = MOCK_TODAY_DELIVERIES.find((item) => item.id === orderDetailId);
    if (order) {
      return ok<Order>(order);
    }
  }

  // --- User ---
  if (method === 'get' && url === '/driver/profile') {
    return ok<Driver>(MOCK_DRIVER);
  }
  if (method === 'get' && url === '/notifications') {
    return ok<Notification[]>(MOCK_NOTIFICATIONS);
  }
  const notificationReadId = method === 'patch' ? matchId(url, '/notifications', '/read') : null;
  if (notificationReadId) {
    return ok<undefined>(undefined);
  }

  throw new Error(`[mock] No mock handler for ${method.toUpperCase()} ${url}`);
};
