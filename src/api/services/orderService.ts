import { deliveryService } from './deliveryService';
import type {
  CompletedDeliveryDetail,
  DeliveryHistoryPage,
  DeliveryHistoryParams,
  Order,
  Paginated,
} from '../../types';

/** /deliveries/today is one unpaged list; the order list state expects Paginated. */
const asSinglePage = (items: Order[]): Paginated<Order> => ({
  items,
  page: 1,
  totalPages: 1,
  totalItems: items.length,
});

/**
 * Orders domain — the Orders tab's view of the same /deliveries routes
 * (see ORDER_ENDPOINTS). The live API has no per-id GET for an open
 * order, so a detail is read from today's list.
 */
export const orderService = {
  async getOrders(): Promise<Paginated<Order>> {
    return asSinglePage(await deliveryService.getTodayDeliveries());
  },

  async getOrderById(orderId: string): Promise<Order> {
    const order = (await deliveryService.getTodayDeliveries()).find((item) => item.id === orderId);
    if (!order) {
      throw new Error("This order isn't in today's deliveries any more.");
    }
    return order;
  },

  async getOrderHistory(params?: DeliveryHistoryParams): Promise<DeliveryHistoryPage> {
    return deliveryService.getDeliveryHistory(params);
  },

  async getCompletedOrderDetail(orderId: string): Promise<CompletedDeliveryDetail> {
    return deliveryService.getCompletedDeliveryDetail(orderId);
  },
};
