import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { resetActiveDelivery, setActiveDelivery } from '../../../store/slices/deliverySlice';
import { selectLastCompletedSummary, selectNextDelivery } from '../../../store/selectors/deliverySelectors';
import { ROUTES } from '../../../constants/routes';
import type { DeliveryCompleteScreenProps } from './types';

export const useDeliveryComplete = (navigation: DeliveryCompleteScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const summary = useAppSelector(selectLastCompletedSummary);
  // The just-completed delivery is already filtered out of `today` by
  // verifyActiveDeliveryOtp.fulfilled, so this genuinely points to
  // whatever's next.
  const nextDelivery = useAppSelector(selectNextDelivery);

  const payment = summary?.payment ?? null;
  const isPartial = payment?.split === 'partial';
  // What the customer still owes after a partial collection; 0 for a full one.
  const pendingBalance = payment && isPartial ? Math.max(0, payment.payableAmount - payment.amount) : 0;

  /** Jumps straight into the next pending delivery's flow if one exists, else back to the list. */
  const handleViewNextDelivery = (): void => {
    dispatch(resetActiveDelivery());
    if (nextDelivery) {
      dispatch(setActiveDelivery(nextDelivery));
      navigation.navigate(ROUTES.ACTIVE_DELIVERY);
    } else {
      navigation.navigate(ROUTES.ORDER_LIST);
    }
  };

  const handleBackToDeliveries = (): void => {
    dispatch(resetActiveDelivery());
    navigation.navigate(ROUTES.ORDER_LIST);
  };

  return {
    summary,
    deliveredItems: summary?.deliveredItems ?? [],
    emptyItems: summary?.emptyItems ?? [],
    payment,
    isPartial,
    pendingBalance,
    handleViewNextDelivery,
    handleBackToDeliveries,
    handleBack: () => navigation.goBack(),
  };
};
