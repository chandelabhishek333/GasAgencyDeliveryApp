import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrderHistory } from '../../../store/slices/ordersSlice';
import {
  selectOrderHistory,
  selectOrderHistoryStatus,
  selectOrdersError,
} from '../../../store/selectors/ordersSelectors';
import type { OrderHistoryPeriod } from '../../../types';
import type { OrderHistoryScreenProps } from './types';

export const useOrderHistory = (navigation: OrderHistoryScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const [period, setPeriod] = useState<OrderHistoryPeriod>('today');
  const history = useAppSelector(selectOrderHistory);
  const status = useAppSelector(selectOrderHistoryStatus);
  const error = useAppSelector(selectOrdersError);

  useEffect(() => {
    dispatch(fetchOrderHistory({ period }));
  }, [dispatch, period]);

  return {
    period,
    setPeriod,
    history,
    isInitialLoading: status === 'loading' && history.length === 0,
    error,
    handleBack: () => navigation.goBack(),
  };
};
