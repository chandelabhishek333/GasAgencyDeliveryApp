import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrderById } from '../../../store/slices/ordersSlice';
import { setActiveDelivery } from '../../../store/slices/deliverySlice';
import {
  selectOrderDetailStatus,
  selectOrdersError,
  selectSelectedOrder,
} from '../../../store/selectors/ordersSelectors';
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
  const { orderId } = route.params;

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  const isLoading = status === 'loading' && (!order || order.id !== orderId);

  const handleCallPress = (): void => {
    if (order) {
      Linking.openURL(`tel:${order.customerPhone}`);
    }
  };

  const handleNavigatePress = (): void => {
    if (order) {
      openInMaps(order.address);
    }
  };

  // "Out for Delivery": starts the active-delivery flow at location verification.
  const handleOutForDelivery = (): void => {
    if (order) {
      dispatch(setActiveDelivery(order));
      navigation.navigate(ROUTES.ACTIVE_DELIVERY);
    }
  };

  return {
    order,
    isLoading,
    error,
    handleBack: () => navigation.goBack(),
    handleCallPress,
    handleNavigatePress,
    handleOutForDelivery,
  };
};
