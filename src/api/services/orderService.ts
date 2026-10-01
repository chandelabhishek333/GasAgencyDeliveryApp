import { apiClient } from '../client';
import { ORDER_ENDPOINTS } from '../endpoints/orderEndpoints';
import { toOrder, toOrders, unwrapResponse } from '../mappers/deliveryMappers';
import type { ApiDelivery } from '../mappers/deliveryMappers';
import { withDevMockFallback } from '../mocks/devFallback';
import type { Order, OrderListParams, Paginated } from '../../types';

/** The live API returns plain arrays (no paging); the app's list state expects Paginated. */
const asSinglePage = (items: Order[]): Paginated<Order> => ({
  items,
  page: 1,
  totalPages: 1,
  totalItems: items.length,
});

/**
 * Orders domain — order list, detail, and history, served by the live
 * API's /deliveries routes. Responses go through src/api/mappers. In dev
 * builds each call falls back to mock data if the real endpoint fails or
 * is empty (see withDevMockFallback).
 */
export const orderService = {
  // Only `limit` is a live query param; status/period filtering stays client-side.
  async getOrders(params?: OrderListParams): Promise<Paginated<Order>> {
    return withDevMockFallback('get', ORDER_ENDPOINTS.LIST, async () => {
      const response = await apiClient.get(ORDER_ENDPOINTS.LIST, { params: { limit: params?.limit } });
      return asSinglePage(toOrders(response.data));
    });
  },

  async getOrderById(orderId: string): Promise<Order> {
    return withDevMockFallback('get', ORDER_ENDPOINTS.DETAIL(orderId), async () => {
      const response = await apiClient.get(ORDER_ENDPOINTS.DETAIL(orderId));
      return toOrder(unwrapResponse<ApiDelivery | Order>(response.data));
    });
  },

  async getOrderHistory(params?: OrderListParams): Promise<Paginated<Order>> {
    return withDevMockFallback('get', ORDER_ENDPOINTS.HISTORY, async () => {
      const response = await apiClient.get(ORDER_ENDPOINTS.HISTORY, { params: { limit: params?.limit } });
      return asSinglePage(toOrders(response.data));
    });
  },
};
