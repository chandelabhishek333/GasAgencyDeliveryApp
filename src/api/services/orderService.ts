import { apiClient } from '../client';
import { ORDER_ENDPOINTS } from '../endpoints/orderEndpoints';
import type { ApiSuccessResponse, Order, OrderListParams, Paginated } from '../../types';

/** Orders domain — order list, detail, and history. */
export const orderService = {
  async getOrders(params?: OrderListParams): Promise<Paginated<Order>> {
    const response = await apiClient.get<ApiSuccessResponse<Paginated<Order>>>(
      ORDER_ENDPOINTS.LIST,
      { params },
    );
    return response.data.data;
  },

  async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get<ApiSuccessResponse<Order>>(
      ORDER_ENDPOINTS.DETAIL(orderId),
    );
    return response.data.data;
  },

  async getOrderHistory(params?: OrderListParams): Promise<Paginated<Order>> {
    const response = await apiClient.get<ApiSuccessResponse<Paginated<Order>>>(
      ORDER_ENDPOINTS.HISTORY,
      { params },
    );
    return response.data.data;
  },
};
