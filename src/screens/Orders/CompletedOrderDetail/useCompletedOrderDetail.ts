import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getCompletedDeliveryDetail } from '../../../store/slices/ordersSlice';
import {
  selectCompletedDetail,
  selectCompletedDetailStatus,
  selectOrdersError,
} from '../../../store/selectors/ordersSelectors';
import type { CompletedOrderDetailScreenProps } from './types';

/** Read-only view of a finished delivery — GET /deliveries/{id}/completed-detail, no delivery actions. */
export const useCompletedOrderDetail = (
  navigation: CompletedOrderDetailScreenProps['navigation'],
  route: CompletedOrderDetailScreenProps['route'],
) => {
  const dispatch = useAppDispatch();
  const detail = useAppSelector(selectCompletedDetail);
  const status = useAppSelector(selectCompletedDetailStatus);
  const error = useAppSelector(selectOrdersError);
  const { orderId } = route.params;

  useEffect(() => {
    dispatch(getCompletedDeliveryDetail(orderId));
  }, [dispatch, orderId]);

  // Ignore a detail still in the store from a previously opened order.
  const current = detail?.id === orderId ? detail : null;

  return {
    detail: current,
    isLoading: status === 'loading' && !current,
    error,
    payment: current?.payment ?? null,
    handleBack: () => navigation.goBack(),
    handleCallPress: () => {
      if (current) {
        Linking.openURL(`tel:${current.customer.phone}`);
      }
    },
  };
};
