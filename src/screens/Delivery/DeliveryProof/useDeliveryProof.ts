import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { confirmActiveDelivery, updateDraft } from '../../../store/slices/deliverySlice';
import {
  selectActiveDelivery,
  selectDeliveryActionStatus,
  selectDeliveryDraft,
  selectDeliveryError,
} from '../../../store/selectors/deliverySelectors';
import { ROUTES } from '../../../constants/routes';
import type { DeliveryProofScreenProps } from './types';

export const useDeliveryProof = (navigation: DeliveryProofScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const activeDelivery = useAppSelector(selectActiveDelivery);
  const draft = useAppSelector(selectDeliveryDraft);
  const actionStatus = useAppSelector(selectDeliveryActionStatus);
  const error = useAppSelector(selectDeliveryError);

  const cylinderItem = activeDelivery?.items.find((item) => item.kind === 'cylinderDelivery');
  const emptyItem = activeDelivery?.items.find((item) => item.kind === 'emptyCollection');

  const handleProceed = async (): Promise<void> => {
    if (!activeDelivery || !draft) {
      return;
    }
    try {
      await dispatch(
        confirmActiveDelivery({
          deliveryId: activeDelivery.id,
          payload: {
            deliveredQuantity: draft.deliveredQuantity,
            emptyCollectedQuantity: draft.emptyCollectedQuantity,
            notes: draft.notes || undefined,
          },
        }),
      ).unwrap();
      navigation.navigate(ROUTES.CUSTOMER_OTP);
    } catch {
      // deliverySlice.error already reflects the failure.
    }
  };

  return {
    activeDelivery,
    draft,
    cylinderItem,
    emptyItem,
    isLoading: actionStatus === 'loading',
    error,
    setDeliveredQuantity: (value: number) => dispatch(updateDraft({ deliveredQuantity: value })),
    setEmptyCollectedQuantity: (value: number) =>
      dispatch(updateDraft({ emptyCollectedQuantity: value })),
    setNotes: (notes: string) => dispatch(updateDraft({ notes })),
    handleProceed,
    handleBack: () => navigation.goBack(),
  };
};
