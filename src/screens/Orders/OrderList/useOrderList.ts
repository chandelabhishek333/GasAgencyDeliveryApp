import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useHasLoadedOnce } from '../../../hooks/useHasLoadedOnce';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrders, setSearchQuery, setStatusFilter } from '../../../store/slices/ordersSlice';
import { setActiveDelivery } from '../../../store/slices/deliverySlice';
import type { OrderStatusFilter } from '../../../store/slices/ordersSlice';
import {
  selectFilteredOrders,
  selectOrderSearchQuery,
  selectOrderStatusCounts,
  selectOrderStatusFilter,
  selectOrdersError,
  selectOrdersListStatus,
} from '../../../store/selectors/ordersSelectors';
import { ROUTES } from '../../../constants/routes';
import type { Order } from '../../../types';
import type { OrderListScreenProps } from './types';

export const useOrderList = (navigation: OrderListScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectFilteredOrders);
  const statusCounts = useAppSelector(selectOrderStatusCounts);
  const statusFilter = useAppSelector(selectOrderStatusFilter);
  const searchQuery = useAppSelector(selectOrderSearchQuery);
  const listStatus = useAppSelector(selectOrdersListStatus);
  const error = useAppSelector(selectOrdersError);

  // Reloaded on every focus (e.g. back from a completed delivery) and on pull-to-refresh.
  const reload = useCallback(() => [dispatch(fetchOrders())], [dispatch]);
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );
  const { refreshing, handleRefresh } = usePullToRefresh(reload);
  const hasLoadedOnce = useHasLoadedOnce(listStatus);

  // Each status opens where the driver actually is in that order's flow:
  // pending -> Order Details, out for delivery -> straight to location
  // verification (Active Delivery), completed/failed -> read-only view
  // (a failed delivery must not offer "Out for Delivery" again).
  const handleOrderPress = (order: Order): void => {
    switch (order.status) {
      case 'out_for_delivery':
        dispatch(setActiveDelivery(order));
        navigation.navigate(ROUTES.ACTIVE_DELIVERY);
        return;
      case 'completed':
      case 'failed':
        navigation.navigate(ROUTES.COMPLETED_ORDER_DETAIL, { orderId: order.id });
        return;
      default:
        navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: order.id });
    }
  };

  return {
    refreshing,
    handleRefresh,
    orders,
    statusCounts,
    statusFilter,
    searchQuery,
    // Full-screen loader on the very first load only; focus re-fetches refresh in place.
    isInitialLoading: !hasLoadedOnce && orders.length === 0,
    error,
    handleSearchChange: (text: string) => dispatch(setSearchQuery(text)),
    handleFilterChange: (filter: OrderStatusFilter) => dispatch(setStatusFilter(filter)),
    handleOrderPress,
  };
};
