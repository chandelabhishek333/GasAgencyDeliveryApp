import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setDriverLocation, verifyLocation } from '../../../store/slices/deliverySlice';
import {
  selectActiveDelivery,
  selectDeliveryActionStatus,
  selectDeliveryError,
} from '../../../store/selectors/deliverySelectors';
import { getCurrentLocation } from '../../../utils/getCurrentLocation';
import { openInMaps } from '../../../utils/openInMaps';
import { ROUTES } from '../../../constants/routes';
import type { ActiveDeliveryScreenProps } from './types';

export const useActiveDelivery = (navigation: ActiveDeliveryScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const activeDelivery = useAppSelector(selectActiveDelivery);
  const actionStatus = useAppSelector(selectDeliveryActionStatus);
  const error = useAppSelector(selectDeliveryError);

  const isLoading = actionStatus === 'loading';

  const handleAtLocation = async (): Promise<void> => {
    if (!activeDelivery) {
      return;
    }
    try {
      // Real device GPS fix when permission is granted, else a fixed
      // near-address fallback — see getCurrentLocation.ts.
      const location = await getCurrentLocation();
      dispatch(setDriverLocation(location));
      // Rejects (with the distance) when the server says the driver isn't there yet.
      await dispatch(verifyLocation({ deliveryId: activeDelivery.id, location })).unwrap();
      navigation.navigate(ROUTES.DELIVERY_PROOF);
    } catch {
      // deliverySlice.error already reflects the failure.
    }
  };

  const handleOpenMaps = (): void => {
    if (activeDelivery) {
      openInMaps(activeDelivery.customer);
    }
  };

  return {
    activeDelivery,
    /** False on a first delivery to this customer — the driver's fix becomes their saved location. */
    isLocationCaptured: activeDelivery?.customer.isLocationCaptured ?? false,
    isLoading,
    error: actionStatus === 'failed' ? error : null,
    handleAtLocation,
    handleOpenMaps,
    handleViewOrderDetails: () => navigation.goBack(),
    handleBack: () => navigation.goBack(),
  };
};
