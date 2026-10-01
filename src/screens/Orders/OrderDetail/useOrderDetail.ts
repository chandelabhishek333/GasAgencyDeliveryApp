import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrderById } from '../../../store/slices/ordersSlice';
import { markOutForDelivery, setActiveDelivery } from '../../../store/slices/deliverySlice';
import {
  selectOrderDetailStatus,
  selectOrdersError,
  selectSelectedOrder,
} from '../../../store/selectors/ordersSelectors';
import { selectDeliveryActionStatus, selectDeliveryError } from '../../../store/selectors/deliverySelectors';
import { openInMaps } from '../../../utils/openInMaps';
import { ROUTES } from '../../../constants/routes';
import type { OrderDetailScreenProps } from './types';

export const useOrderDetail = (
  navigation: OrderDetailScreenProps['navigation'],
  route: OrderDetailScreenProps['route'],
) => {
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectSelectedOrder);
  const status = useAppSelector(selectOrderDetailStatus);
  const error = useAppSelector(selectOrdersError);
  const actionStatus = useAppSelector(selectDeliveryActionStatus);
  const actionError = useAppSelector(selectDeliveryError);
  const { orderId } = route.params;

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  const isLoading = status === 'loading' && (!order || order.id !== orderId);

  const handleCallPress = (): void => {
    if (order) {
      Linking.openURL(`tel:${order.customer.phone}`);
    }
  };

  const handleNavigatePress = (): void => {
    if (order) {
      openInMaps(order.customer);
    }
  };

  // "Out for Delivery": POST out-for-delivery for a pending order, then into
  // location verification. An order already out for delivery just resumes.
  const handleOutForDelivery = async (): Promise<void> => {
    if (!order) {
      return;
    }
    try {
      if (order.status === 'pending') {
        const result = await dispatch(markOutForDelivery(order.id)).unwrap();
        dispatch(setActiveDelivery({ ...order, status: result.status }));
      } else {
        dispatch(setActiveDelivery(order));
      }
      navigation.navigate(ROUTES.ACTIVE_DELIVERY);
    } catch {
      // deliverySlice.error already reflects the failure.
    }
  };

  return {
    order,
    isLoading,
    error,
    isStarting: actionStatus === 'loading',
    startError: actionStatus === 'failed' ? actionError : null,
    handleBack: () => navigation.goBack(),
    handleCallPress,
    handleNavigatePress,
    handleOutForDelivery,
  };
};
