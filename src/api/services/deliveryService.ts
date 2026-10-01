import { apiClient } from '../client';
import { DELIVERY_ENDPOINTS } from '../endpoints/deliveryEndpoints';
import {
  toCompletedDetail,
  toConfirmResponse,
  toDeliverySummary,
  toGenerateQr,
  toHistoryPage,
  toOrders,
  toOutForDelivery,
  toSingleOrder,
  toVerifyLocation,
} from '../mappers/deliveryMappers';
import { withDevMockFallback } from '../mocks/devFallback';
import type {
  CompletedDeliveryDetail,
  ConfirmDeliveryRequest,
  ConfirmDeliveryResponse,
  Delivery,
  DeliveryHistoryPage,
  DeliveryHistoryParams,
  DeliverySummary,
  GenerateQrRequest,
  GenerateQrResponse,
  OutForDeliveryResponse,
  UpdateOrderItemsRequest,
  VerifyCustomerOtpRequest,
  VerifyLocationRequest,
  VerifyLocationResponse,
} from '../../types';

const get = (url: string, params?: object) => (): Promise<unknown> =>
  apiClient.get(url, { params }).then((response) => response.data);

const post = (url: string, body?: unknown) => (): Promise<unknown> =>
  apiClient.post(url, body ?? {}).then((response) => response.data);

/**
 * Delivery domain — the driver's whole delivery lifecycle, in order:
 * today's list -> out for delivery -> verify location -> (update items)
 * -> (generate QR) -> confirm -> customer OTP -> completed detail /
 * history. Responses go through src/api/mappers. In dev builds each call
 * falls back to the mocks if the live one fails (see withDevMockFallback).
 */
export const deliveryService = {
  /** GET /deliveries/today */
  async getTodayDeliveries(): Promise<Delivery[]> {
    const url = DELIVERY_ENDPOINTS.TODAY;
    return withDevMockFallback({ method: 'get', url }, get(url), toOrders);
  },

  /** POST /deliveries/{id}/out-for-delivery — pending -> out_for_delivery. */
  async markOutForDelivery(deliveryId: string): Promise<OutForDeliveryResponse> {
    const url = DELIVERY_ENDPOINTS.OUT_FOR_DELIVERY(deliveryId);
    return withDevMockFallback({ method: 'post', url }, post(url), toOutForDelivery);
  },

  /** POST /deliveries/{id}/verify-location — also locks the customer's coordinates the first time. */
  async verifyLocation(deliveryId: string, payload: VerifyLocationRequest): Promise<VerifyLocationResponse> {
    const url = DELIVERY_ENDPOINTS.VERIFY_LOCATION(deliveryId);
    return withDevMockFallback({ method: 'post', url, data: payload }, post(url, payload), toVerifyLocation);
  },

  /** PUT /deliveries/{id}/update-items — answers with the recalculated delivery (items, empties, billing). */
  async updateOrderItems(deliveryId: string, payload: UpdateOrderItemsRequest): Promise<Delivery> {
    const url = DELIVERY_ENDPOINTS.UPDATE_ITEMS(deliveryId);
    return withDevMockFallback(
      { method: 'put', url, data: payload },
      () => apiClient.put(url, payload).then((response) => response.data),
      toSingleOrder,
    );
  },

  /** POST /deliveries/{id}/generate-qr — a dynamic UPI QR for the exact amount. */
  async generatePaymentQr(deliveryId: string, payload: GenerateQrRequest): Promise<GenerateQrResponse> {
    const url = DELIVERY_ENDPOINTS.GENERATE_QR(deliveryId);
    return withDevMockFallback({ method: 'post', url, data: payload }, post(url, payload), toGenerateQr);
  },

  /** POST /deliveries/{id}/confirm — sends the customer their OTP (in-app notification). */
  async confirmDelivery(deliveryId: string, payload: ConfirmDeliveryRequest): Promise<ConfirmDeliveryResponse> {
    const url = DELIVERY_ENDPOINTS.CONFIRM(deliveryId);
    return withDevMockFallback({ method: 'post', url, data: payload }, post(url, payload), toConfirmResponse);
  },

  /** POST /deliveries/{id}/verify-customer-otp — completes the delivery and returns its receipt. */
  async verifyCustomerOtp(deliveryId: string, payload: VerifyCustomerOtpRequest): Promise<DeliverySummary> {
    const url = DELIVERY_ENDPOINTS.VERIFY_CUSTOMER_OTP(deliveryId);
    return withDevMockFallback({ method: 'post', url, data: payload }, post(url, payload), toDeliverySummary);
  },

  /** GET /deliveries/{id}/completed-detail */
  async getCompletedDeliveryDetail(deliveryId: string): Promise<CompletedDeliveryDetail> {
    const url = DELIVERY_ENDPOINTS.COMPLETED_DETAIL(deliveryId);
    return withDevMockFallback({ method: 'get', url }, get(url), toCompletedDetail);
  },

  /** GET /deliveries/history?period=&page=&limit= */
  async getDeliveryHistory(params: DeliveryHistoryParams = {}): Promise<DeliveryHistoryPage> {
    const url = DELIVERY_ENDPOINTS.HISTORY;
    const query = { period: params.period ?? 'all', page: params.page ?? 1, limit: params.limit ?? 20 };
    return withDevMockFallback({ method: 'get', url: `${url}?period=${query.period}` }, get(url, query), toHistoryPage);
  },
};
