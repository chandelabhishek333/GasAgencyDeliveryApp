import { apiClient } from '../client';
import { PAYMENT_ENDPOINTS } from '../endpoints/paymentEndpoints';
import type {
  ApiSuccessResponse,
  Paginated,
  PaginationParams,
  PaymentMethod,
  PaymentTransaction,
} from '../../types';

/**
 * Payments domain — saved payment methods and transaction history.
 * Scaffolded per src/api/README.md's documented service list
 * (src/screens/Payments/ exists) though not part of the initial
 * 13-screen spec.
 */
export const paymentService = {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiClient.get<ApiSuccessResponse<PaymentMethod[]>>(
      PAYMENT_ENDPOINTS.METHODS,
    );
    return response.data.data;
  },

  async removePaymentMethod(methodId: string): Promise<void> {
    await apiClient.delete(PAYMENT_ENDPOINTS.METHOD_DETAIL(methodId));
  },

  async getPaymentHistory(params?: PaginationParams): Promise<Paginated<PaymentTransaction>> {
    const response = await apiClient.get<ApiSuccessResponse<Paginated<PaymentTransaction>>>(
      PAYMENT_ENDPOINTS.HISTORY,
      { params },
    );
    return response.data.data;
  },
};
