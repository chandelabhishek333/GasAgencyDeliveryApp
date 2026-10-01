import { apiClient } from '../client';
import { DELIVERY_ENDPOINTS } from '../endpoints/deliveryEndpoints';
import { buildConfirmNote, toClockTime, toOrder, toOrders, unwrapResponse } from '../mappers/deliveryMappers';
import type { ApiDelivery } from '../mappers/deliveryMappers';
import { withDevMockFallback } from '../mocks/devFallback';
import type {
  Delivery,
  DeliveryConfirmRequest,
  DeliveryConfirmResponse,
  DeliveryStartRequest,
  DeliveryStartResponse,
  DeliverySummary,
  VerifyCustomerOtpRequest,
} from '../../types';

/**
 * Delivery domain — today's assigned deliveries and the active
 * delivery workflow (location verify -> confirm quantities -> customer OTP).
 * Responses go through src/api/mappers (live bare shapes and mock
 * envelopes alike). In dev builds each call falls back to mock data if
 * the real endpoint fails or is empty (see withDevMockFallback).
 */
export const deliveryService = {
  async getTodayDeliveries(): Promise<Delivery[]> {
    return withDevMockFallback('get', DELIVERY_ENDPOINTS.TODAY, async () => {
      const response = await apiClient.get(DELIVERY_ENDPOINTS.TODAY);
      return toOrders(response.data);
    });
  },

  async getDeliveryById(deliveryId: string): Promise<Delivery> {
    return withDevMockFallback('get', DELIVERY_ENDPOINTS.DETAIL(deliveryId), async () => {
      const response = await apiClient.get(DELIVERY_ENDPOINTS.DETAIL(deliveryId));
      return toOrder(unwrapResponse<ApiDelivery | Delivery>(response.data));
    });
  },

  async startDelivery(
    deliveryId: string,
    payload: DeliveryStartRequest,
  ): Promise<DeliveryStartResponse> {
    return withDevMockFallback('post', DELIVERY_ENDPOINTS.START(deliveryId), async () => {
      const response = await apiClient.post(DELIVERY_ENDPOINTS.START(deliveryId), payload);
      const data = unwrapResponse<{ isAtLocation: boolean; distanceMetersFromDestination: number | null }>(
        response.data,
      );
      return {
        isAtLocation: data.isAtLocation,
        distanceMetersFromDestination: data.distanceMetersFromDestination ?? 0,
      };
    });
  },

  // The live body is { deliveredQuantity, emptyCollectedQuantity, note }:
  // the per-type breakdown has no field, and payment rides at the front
  // of `note` until the API gets payment fields (see buildConfirmNote).
  async confirmDelivery(
    deliveryId: string,
    payload: DeliveryConfirmRequest,
  ): Promise<DeliveryConfirmResponse> {
    return withDevMockFallback('post', DELIVERY_ENDPOINTS.CONFIRM(deliveryId), async () => {
      const response = await apiClient.post(DELIVERY_ENDPOINTS.CONFIRM(deliveryId), {
        deliveredQuantity: payload.deliveredQuantity,
        emptyCollectedQuantity: payload.emptyCollectedQuantity,
        note: buildConfirmNote(payload.notes, payload.payment),
      });
      const data = unwrapResponse<DeliveryConfirmResponse>(response.data);
      return { deliveryId: data.deliveryId, customerOtpRequired: data.customerOtpRequired };
    });
  },

  async verifyCustomerOtp(
    deliveryId: string,
    payload: VerifyCustomerOtpRequest,
  ): Promise<DeliverySummary> {
    return withDevMockFallback('post', DELIVERY_ENDPOINTS.VERIFY_CUSTOMER_OTP(deliveryId), async () => {
      const response = await apiClient.post(DELIVERY_ENDPOINTS.VERIFY_CUSTOMER_OTP(deliveryId), payload);
      const data = unwrapResponse<DeliverySummary>(response.data);
      return { ...data, completedAt: toClockTime(data.completedAt) };
    });
  },
};
