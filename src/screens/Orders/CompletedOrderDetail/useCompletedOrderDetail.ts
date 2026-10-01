import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrderById } from '../../../store/slices/ordersSlice';
import {
  selectOrderDetailStatus,
  selectOrdersError,
  selectSelectedOrder,
} from '../../../store/selectors/ordersSelectors';
import { getPayableAmount } from '../../../utils/getPayableAmount';
import type { CompletedOrderDetailScreenProps } from './types';

/** Read-only view of a finished delivery — same order fetch as Order Details, no delivery actions. */
export const useCompletedOrderDetail = (
  navigation: CompletedOrderDetailScreenProps['navigation'],
  route: CompletedOrderDetailScreenProps['route'],
) => {
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectSelectedOrder);
  const status = useAppSelector(selectOrderDetailStatus);
  const error = useAppSelector(selectOrdersError);
  const { orderId } = route.params;

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  // selectedOrder is shared with Order Details, so ignore a stale one for a different id.
  const currentOrder = order?.id === orderId ? order : null;
  const payment = currentOrder?.payment ?? null;
  const totalAmount = payment?.payableAmount ?? (currentOrder ? getPayableAmount(currentOrder) : 0);

  return {
    order: currentOrder,
    isLoading: status === 'loading' && !currentOrder,
    error,
    payment,
    totalAmount,
    pendingBalance: payment ? Math.max(0, totalAmount - payment.amount) : 0,
    handleBack: () => navigation.goBack(),
    handleCallPress: () => {
      if (currentOrder) {
        Linking.openURL(`tel:${currentOrder.customerPhone}`);
      }
    },
  };
};
