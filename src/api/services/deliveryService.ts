import { apiClient } from '../client';
import { DELIVERY_ENDPOINTS } from '../endpoints/deliveryEndpoints';
import type {
  ApiSuccessResponse,
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
 */
export const deliveryService = {
  async getTodayDeliveries(): Promise<Delivery[]> {
    const response = await apiClient.get<ApiSuccessResponse<Delivery[]>>(
      DELIVERY_ENDPOINTS.TODAY,
    );
    return response.data.data;
  },

  async getDeliveryById(deliveryId: string): Promise<Delivery> {
    const response = await apiClient.get<ApiSuccessResponse<Delivery>>(
      DELIVERY_ENDPOINTS.DETAIL(deliveryId),
    );
    return response.data.data;
  },

  async startDelivery(
    deliveryId: string,
    payload: DeliveryStartRequest,
  ): Promise<DeliveryStartResponse> {
    const response = await apiClient.post<ApiSuccessResponse<DeliveryStartResponse>>(
      DELIVERY_ENDPOINTS.START(deliveryId),
      payload,
    );
    return response.data.data;
  },

  async confirmDelivery(
    deliveryId: string,
    payload: DeliveryConfirmRequest,
  ): Promise<DeliveryConfirmResponse> {
    const response = await apiClient.post<ApiSuccessResponse<DeliveryConfirmResponse>>(
      DELIVERY_ENDPOINTS.CONFIRM(deliveryId),
      payload,
    );
    return response.data.data;
  },

  async verifyCustomerOtp(
    deliveryId: string,
    payload: VerifyCustomerOtpRequest,
  ): Promise<DeliverySummary> {
    const response = await apiClient.post<ApiSuccessResponse<DeliverySummary>>(
      DELIVERY_ENDPOINTS.VERIFY_CUSTOMER_OTP(deliveryId),
      payload,
    );
    return response.data.data;
  },
};
