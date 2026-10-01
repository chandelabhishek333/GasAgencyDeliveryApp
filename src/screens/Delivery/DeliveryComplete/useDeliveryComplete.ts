import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { resetActiveDelivery, setActiveDelivery } from '../../../store/slices/deliverySlice';
import { selectLastCompletedSummary, selectNextDelivery } from '../../../store/selectors/deliverySelectors';
import { ROUTES } from '../../../constants/routes';
import type { DeliveryCompleteScreenProps } from './types';

export const useDeliveryComplete = (navigation: DeliveryCompleteScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const summary = useAppSelector(selectLastCompletedSummary);
  // verifyActiveDeliveryOtp.fulfilled already marked the just-finished
  // delivery completed in `today`, so this points to whatever's next.
  const nextDelivery = useAppSelector(selectNextDelivery);

  const payment = summary?.payment ?? null;
  const isPartial = payment?.split === 'partial';

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
    emptyItems: summary?.emptyCollectedItems ?? [],
    /** Empties not returned this time — the server added them to the customer's pending due. */
    emptiesAddedToDue: summary?.emptyDueSummary.addedToCustomerPendingDue ?? 0,
    payment,
    isPartial,
    // What the customer still owes after a partial collection; 0 for a full one.
    pendingBalance: payment?.pendingBalance ?? 0,
    handleViewNextDelivery,
    handleBackToDeliveries,
    handleBack: () => navigation.goBack(),
  };
};
