import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTodayDeliveries } from '../../store/slices/deliverySlice';
import { setDutyStatus } from '../../store/slices/authSlice';
import {
  selectDeliveryError,
  selectDeliveryStats,
  selectNextDelivery,
  selectTodayDeliveries,
  selectTodayStatus,
} from '../../store/selectors/deliverySelectors';
import { selectDriver } from '../../store/selectors/authSelectors';
import { getGreeting } from '../../utils/getGreeting';
import { getInitials } from '../../utils/getInitials';
import { formatShortDate } from '../../utils/formatShortDate';
import { ROUTES } from '../../constants/routes';
import type { HomeScreenProps, ShiftSummary, VehicleStock } from './types';

// TODO: confirm endpoint — no vehicle/inventory service exists yet in
// src/api/services/. Placeholder values match the reference mockup
// until a real vehicle-stock endpoint is specified.
const PLACEHOLDER_VEHICLE_STOCK: VehicleStock = {
  truckFullStock: 24,
  truckCapacity: 30,
  emptyCollected: 6,
};

// TODO: confirm endpoint — no shift-tracking service exists yet
// either. Placeholder values until a real one is specified.
const PLACEHOLDER_SHIFT_SUMMARY: ShiftSummary = {
  distanceCovered: '18.5 km',
  timeOnRoad: '2 hrs 15m',
  cashToCollect: '₹14,250',
};

export const useHomeScreen = (navigation: HomeScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const driver = useAppSelector(selectDriver);
  const today = useAppSelector(selectTodayDeliveries);
  const todayStatus = useAppSelector(selectTodayStatus);
  const error = useAppSelector(selectDeliveryError);
  const stats = useAppSelector(selectDeliveryStats);
  const nextDelivery = useAppSelector(selectNextDelivery);

  useEffect(() => {
    dispatch(fetchTodayDeliveries());
  }, [dispatch]);

  const handleToggleDuty = useCallback(
    (onDuty: boolean) => {
      dispatch(setDutyStatus(onDuty));
    },
    [dispatch],
  );

  const cylinderItem = nextDelivery?.items.find((item) => item.kind === 'cylinderDelivery');
  const emptyItem = nextDelivery?.items.find((item) => item.kind === 'emptyCollection');
  const nextDeliverySummary =
    cylinderItem && emptyItem
      ? `${cylinderItem.quantity} × ${cylinderItem.label} (Collect: ${emptyItem.quantity} Empty)`
      : cylinderItem?.label ?? '';

  return {
    driver,
    initials: driver ? driver.avatarInitials ?? getInitials(driver.name) : '',
    greeting: getGreeting(),
    todayDate: formatShortDate(new Date()),
    isInitialLoading: todayStatus === 'loading' && today.length === 0,
    error,
    stats,
    nextDelivery,
    nextDeliverySummary,
    vehicleStock: PLACEHOLDER_VEHICLE_STOCK,
    shiftSummary: PLACEHOLDER_SHIFT_SUMMARY,
    handleToggleDuty,
    handleViewAllPress: () => navigation.navigate(ROUTES.ORDER_LIST),
    handleNextDeliveryPress: () => {
      if (nextDelivery) {
        navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: nextDelivery.id });
      }
    },
  };
};
