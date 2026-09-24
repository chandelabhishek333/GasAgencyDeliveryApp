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
    handleViewNextDelivery,
    handleBackToDeliveries,
    handleBack: () => navigation.goBack(),
  };
};
