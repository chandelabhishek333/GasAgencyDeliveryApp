import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useHasLoadedOnce } from '../../hooks/useHasLoadedOnce';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTodayDeliveries } from '../../store/slices/deliverySlice';
import { syncDutyStatus, updateDutyStatus } from '../../store/slices/authSlice';
import { fetchInventory } from '../../store/slices/userSlice';
import { selectInventory } from '../../store/selectors/userSelectors';
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
import { formatDeliveryDate, formatShortDate } from '../../utils/formatShortDate';
import { ROUTES } from '../../constants/routes';
import { formatRupees } from '../../utils/formatRupees';
import type { OrderItem } from '../../types';
import type { CylinderRow, HomeScreenProps, ShiftSummary, VehicleStock } from './types';

const formatQty = (item: OrderItem): string => `${item.quantity} × ${item.label}`;

/**
 * One row per delivered cylinder type, each paired with the empties to
 * collect for the same cylinderType: [{ "5 × 19 KG Commercial", "(Collect: 6 × 19 KG Empty)" }, …].
 * Empties with no delivered counterpart (a previous due only) get a row of their own.
 */
const buildCylinderRows = (items: OrderItem[]): CylinderRow[] => {
  const cylinders = items.filter((item) => item.kind === 'cylinderDelivery');
  const empties = items.filter((item) => item.kind === 'emptyCollection');
  const rows: CylinderRow[] = cylinders.map((cylinder) => {
    const empty = empties.find((item) => item.cylinderType === cylinder.cylinderType);
    return {
      key: cylinder.id,
      delivery: formatQty(cylinder),
      collect: empty ? `(Collect: ${formatQty(empty)})` : null,
    };
  });
  return rows.concat(
    empties
      .filter((empty) => !cylinders.some((cylinder) => cylinder.cylinderType === empty.cylinderType))
      .map((empty) => ({ key: empty.id, delivery: null, collect: `(Collect: ${formatQty(empty)})` })),
  );
};

// TODO: confirm endpoint — the API has no distance/time-on-road tracking.
// Placeholder values until one is specified; cash to collect is real (below).
const PLACEHOLDER_SHIFT_SUMMARY: Omit<ShiftSummary, 'cashToCollect'> = {
  distanceCovered: '18.5 km',
  timeOnRoad: '2 hrs 15m',
};

export const useHomeScreen = (navigation: HomeScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const driver = useAppSelector(selectDriver);
  const today = useAppSelector(selectTodayDeliveries);
  const todayStatus = useAppSelector(selectTodayStatus);
  const error = useAppSelector(selectDeliveryError);
  const stats = useAppSelector(selectDeliveryStats);
  const nextDelivery = useAppSelector(selectNextDelivery);
  const inventory = useAppSelector(selectInventory);

  // Today's deliveries, van stock (GET /driver/inventory) and live duty
  // state (GET /driver/profile) — reloaded every time Home gains focus and
  // on pull-to-refresh.
  const reload = useCallback(
    () => [dispatch(fetchTodayDeliveries()), dispatch(fetchInventory()), dispatch(syncDutyStatus())],
    [dispatch],
  );
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );
  const { refreshing, handleRefresh } = usePullToRefresh(reload);
  const hasLoadedOnce = useHasLoadedOnce(todayStatus);

  // The switch flips immediately; updateDutyStatus flips it back if the
  // server refuses, and the driver is told why.
  const handleToggleDuty = useCallback(
    (onDuty: boolean) => {
      dispatch(updateDutyStatus(onDuty))
        .unwrap()
        .catch((message: string) => Alert.alert('Could not update duty status', message));
    },
    [dispatch],
  );

  const vehicleStock: VehicleStock = {
    truckFullStock: inventory?.totalFullCylinders ?? null,
    emptyCollected: inventory?.totalEmptyCylinders ?? null,
  };

  // Still to collect today: the payable on every delivery not yet completed or failed.
  const cashToCollect = today
    .filter((delivery) => delivery.status === 'pending' || delivery.status === 'out_for_delivery')
    .reduce((total, delivery) => total + delivery.billing.totalPayableAmount, 0);

  const todayDate = formatShortDate(new Date());

  return {
    refreshing,
    handleRefresh,
    driver,
    initials: driver ? driver.avatarInitials ?? getInitials(driver.name) : '',
    greeting: getGreeting(),
    todayDate,
    nextDeliveryDate: nextDelivery?.deliveryDate ? formatDeliveryDate(nextDelivery.deliveryDate) : todayDate,
    // Full-screen loader on the very first load only; focus re-fetches refresh in place.
    isInitialLoading: !hasLoadedOnce && today.length === 0,
    error,
    stats,
    nextDelivery,
    cylinderRows: nextDelivery ? buildCylinderRows(nextDelivery.items) : [],
    vehicleStock,
    shiftSummary: { ...PLACEHOLDER_SHIFT_SUMMARY, cashToCollect: formatRupees(cashToCollect) },
    handleToggleDuty,
    handleViewAllPress: () => navigation.navigate(ROUTES.ORDER_LIST),
    handleNextDeliveryPress: () => {
      if (nextDelivery) {
        navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: nextDelivery.id });
      }
    },
  };
};
