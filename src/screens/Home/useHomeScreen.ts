import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
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
import { cylinderSizeKey } from '../../utils/cylinderSize';
import type { OrderItem } from '../../types';
import type { CylinderRow, HomeScreenProps, ShiftSummary, VehicleStock } from './types';

const formatQty = (item: OrderItem): string => `${item.quantity} × ${item.label}`;

/**
 * One row per delivered cylinder type, each paired with the empty
 * collected for it: [{ "5 × 19 KG Commercial", "(Collect: 5 × 19 KG Empty)" }, …].
 * Items carry no explicit link, so an empty is matched by the cylinder
 * size at the start of its label, falling back to list order. Empties
 * left unmatched still get a row of their own, so nothing is dropped.
 */
const buildCylinderRows = (items: OrderItem[]): CylinderRow[] => {
  const cylinders = items.filter((item) => item.kind === 'cylinderDelivery');
  const unmatchedEmpties = items.filter((item) => item.kind === 'emptyCollection');
  const deliveredSizes = new Set(cylinders.map((item) => cylinderSizeKey(item.label)).filter((size) => size !== null));

  const takeEmptyFor = (cylinder: OrderItem): OrderItem | undefined => {
    const size = cylinderSizeKey(cylinder.label);
    let index = size ? unmatchedEmpties.findIndex((empty) => cylinderSizeKey(empty.label) === size) : -1;
    if (index === -1) {
      // No size match — fall back to the first empty whose size no delivered type claims.
      index = unmatchedEmpties.findIndex((empty) => !deliveredSizes.has(cylinderSizeKey(empty.label) ?? ''));
    }
    return index === -1 ? undefined : unmatchedEmpties.splice(index, 1)[0];
  };

  const rows: CylinderRow[] = cylinders.map((cylinder) => {
    const empty = takeEmptyFor(cylinder);
    return {
      key: cylinder.id,
      delivery: formatQty(cylinder),
      collect: empty ? `(Collect: ${formatQty(empty)})` : null,
    };
  });
  return rows.concat(
    unmatchedEmpties.map((empty) => ({ key: empty.id, delivery: null, collect: `(Collect: ${formatQty(empty)})` })),
  );
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
  const inventory = useAppSelector(selectInventory);

  // Live duty state (GET /driver/profile) and van stock (GET /driver/inventory)
  // load alongside today's deliveries.
  useEffect(() => {
    dispatch(fetchTodayDeliveries());
    dispatch(syncDutyStatus());
    dispatch(fetchInventory());
  }, [dispatch]);

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
    truckFullStock: inventory?.fullCylinderCount ?? null,
    emptyCollected: inventory?.emptyCylinderCount ?? null,
  };

  const todayDate = formatShortDate(new Date());

  return {
    driver,
    initials: driver ? driver.avatarInitials ?? getInitials(driver.name) : '',
    greeting: getGreeting(),
    todayDate,
    nextDeliveryDate: nextDelivery?.deliveryDate ? formatDeliveryDate(nextDelivery.deliveryDate) : todayDate,
    isInitialLoading: todayStatus === 'loading' && today.length === 0,
    error,
    stats,
    nextDelivery,
    cylinderRows: nextDelivery ? buildCylinderRows(nextDelivery.items) : [],
    vehicleStock,
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
