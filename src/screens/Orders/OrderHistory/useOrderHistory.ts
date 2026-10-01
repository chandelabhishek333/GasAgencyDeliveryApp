import { useCallback, useEffect, useState } from 'react';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrderHistory } from '../../../store/slices/ordersSlice';
import {
  selectOrderHistory,
  selectOrderHistoryStatus,
  selectOrdersError,
} from '../../../store/selectors/ordersSelectors';
import { ROUTES } from '../../../constants/routes';
import type { HistoryDeliveryEntry, OrderHistoryPeriod } from '../../../types';
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

  // Re-fetches whichever period tab is showing.
  const { refreshing, handleRefresh } = usePullToRefresh(
    useCallback(() => [dispatch(fetchOrderHistory({ period }))], [dispatch, period]),
  );

  return {
    refreshing,
    handleRefresh,
    period,
    setPeriod,
    history,
    isInitialLoading: status === 'loading' && history.length === 0,
    error,
    /** Completed and failed alike open the read-only receipt (GET completed-detail). */
    handleEntryPress: (entry: HistoryDeliveryEntry) =>
      navigation.navigate(ROUTES.COMPLETED_ORDER_DETAIL, { orderId: entry.id }),
    handleBack: () => navigation.goBack(),
  };
};
