import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setDriverLocation, startActiveDelivery } from '../../../store/slices/deliverySlice';
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
      // near-address fallback — see getCurrentLocation.ts. Stored in
      // deliverySlice separately from `activeDelivery` and also sent
      // as the location-verify payload below.
      const location = await getCurrentLocation();
      dispatch(setDriverLocation(location));
      await dispatch(startActiveDelivery({ deliveryId: activeDelivery.id, location })).unwrap();
      navigation.navigate(ROUTES.DELIVERY_PROOF);
    } catch {
      // deliverySlice.error already reflects the failure.
    }
  };

  const handleOpenMaps = (): void => {
    if (activeDelivery) {
      openInMaps(activeDelivery.address);
    }
  };

  return {
    activeDelivery,
    isLoading,
    error,
    handleAtLocation,
    handleOpenMaps,
    handleViewOrderDetails: () => navigation.goBack(),
    handleBack: () => navigation.goBack(),
  };
};
