import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrders, setSearchQuery, setStatusFilter } from '../../../store/slices/ordersSlice';
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

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleOrderPress = (order: Order): void => {
    navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: order.id });
  };

  return {
    orders,
    statusCounts,
    statusFilter,
    searchQuery,
    isInitialLoading: listStatus === 'loading' && orders.length === 0,
    error,
    handleSearchChange: (text: string) => dispatch(setSearchQuery(text)),
    handleFilterChange: (filter: OrderStatusFilter) => dispatch(setStatusFilter(filter)),
    handleOrderPress,
  };
};
