import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  updateOrderItems,
  confirmActiveDelivery,
  setDraftItemQuantity,
  updateDraft,
} from '../../../store/slices/deliverySlice';
import type { UpdateOrderSelection } from '../../../components/delivery/UpdateOrderSheet/types';
import {
  selectActiveDelivery,
  selectDeliveryActionStatus,
  selectDeliveryDraft,
  selectDeliveryError,
} from '../../../store/selectors/deliverySelectors';
import { ROUTES } from '../../../constants/routes';
import { getDeliveryTotals } from '../../../utils/deliveryTotals';
import { formatRupees } from '../../../utils/formatRupees';
import { getPayableAmount } from '../../../utils/getPayableAmount';
import type { DeliveryPaymentCollection, DeliveryPaymentMethod, DeliveryPaymentSplit, OrderItem } from '../../../types';
import type { DeliveryProofScreenProps } from './types';

/** Keeps digits and a single decimal point with at most 2 decimals (paise). */
const sanitizeAmountInput = (text: string): string => {
  const [whole, ...fraction] = text.replace(/[^0-9.]/g, '').split('.');
  return fraction.length === 0 ? whole : `${whole}.${fraction.join('').slice(0, 2)}`;
};

/** Partial amount must be > 0 and no more than the payable amount. Empty input is not an error until Proceed. */
const parsePartialAmount = (
  input: string,
  payableAmount: number,
): { amount: number | null; error: string | null } => {
  if (!input) {
    return { amount: null, error: null };
  }
  const amount = Number(input);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { amount: null, error: 'Enter an amount greater than ₹0.' };
  }
  if (amount > payableAmount) {
    return { amount: null, error: `Amount can't be more than the payable ${formatRupees(payableAmount)}.` };
  }
  return { amount, error: null };
};

/** "[Order updated: 5 × 19 KG Commercial, 1 × 35 KG Industrial]" — the final cylinder lines after "Update Order". */
const orderUpdateSummary = (items: OrderItem[]): string => {
  const cylinders = items.filter((item) => item.kind === 'cylinderDelivery');
  return `[Order updated: ${cylinders.map((item) => `${item.quantity} × ${item.label}`).join(', ')}]`;
};

export const useDeliveryProof = (navigation: DeliveryProofScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const activeDelivery = useAppSelector(selectActiveDelivery);
  const draft = useAppSelector(selectDeliveryDraft);
  const actionStatus = useAppSelector(selectDeliveryActionStatus);
  const error = useAppSelector(selectDeliveryError);
  // Only flags an *empty* partial amount, and only once Proceed was tapped.
  const [proceedAttempted, setProceedAttempted] = useState(false);
  const [isUpdateSheetOpen, setUpdateSheetOpen] = useState(false);

  const items = activeDelivery?.items ?? [];
  const quantities = draft?.quantities ?? {};
  const cylinderItems = items.filter((item) => item.kind === 'cylinderDelivery');
  const emptyItems = items.filter((item) => item.kind === 'emptyCollection');
  const totals = getDeliveryTotals(items, quantities);

  const payableAmount = activeDelivery ? getPayableAmount(activeDelivery) : 0;
  const paymentSplit = draft?.paymentSplit ?? 'full';
  const partialAmountInput = draft?.partialAmountInput ?? '';
  const partial = parsePartialAmount(partialAmountInput, payableAmount);
  // Amount a QR would be generated for: the full payable, or a valid partial amount.
  const qrAmount = paymentSplit === 'full' ? payableAmount : partial.amount;
  const partialAmountError =
    paymentSplit !== 'partial'
      ? null
      : partial.error ?? (proceedAttempted && !partialAmountInput ? 'Enter the partial amount to collect.' : null);

  const handleProceed = async (): Promise<void> => {
    if (!activeDelivery || !draft) {
      return;
    }
    setProceedAttempted(true);
    const amount = draft.paymentSplit === 'full' ? payableAmount : partial.amount;
    if (amount === null) {
      return;
    }
    const payment: DeliveryPaymentCollection = {
      method: draft.paymentMethod,
      split: draft.paymentSplit,
      amount,
      payableAmount,
    };
    try {
      await dispatch(
        confirmActiveDelivery({
          deliveryId: activeDelivery.id,
          payload: {
            deliveredQuantity: totals.delivered,
            emptyCollectedQuantity: totals.collected,
            // "Update Order" changes have no field in the live API — record the
            // final composition in the note so the server-side record shows it.
            notes:
              [draft.orderUpdated ? orderUpdateSummary(items) : '', draft.notes].filter(Boolean).join(' ') ||
              undefined,
            items: items.map((item) => ({ itemId: item.id, kind: item.kind, quantity: quantities[item.id] ?? 0 })),
            payment,
          },
        }),
      ).unwrap();
      // The confirmed method + amount stay in deliverySlice.confirmedPayment
      // for the OTP step (and a dynamic-QR screen, once one exists).
      navigation.navigate(ROUTES.CUSTOMER_OTP);
    } catch {
      // deliverySlice.error already reflects the failure.
    }
  };

  return {
    activeDelivery,
    draft,
    cylinderItems,
    emptyItems,
    quantities,
    totalDelivered: totals.delivered,
    totalCollected: totals.collected,
    netDifference: totals.delivered - totals.collected,
    payableAmount,
    partialAmount: partial.amount,
    partialAmountError,
    isLoading: actionStatus === 'loading',
    error,
    setItemQuantity: (itemId: string, quantity: number) => dispatch(setDraftItemQuantity({ itemId, quantity })),
    setNotes: (notes: string) => dispatch(updateDraft({ notes })),
    setPaymentMethod: (paymentMethod: DeliveryPaymentMethod) => dispatch(updateDraft({ paymentMethod })),
    setPaymentSplit: (split: DeliveryPaymentSplit) => dispatch(updateDraft({ paymentSplit: split })),
    setPartialAmountInput: (text: string) =>
      dispatch(updateDraft({ partialAmountInput: sanitizeAmountInput(text) })),
    qrAmount,
    isUpdateSheetOpen,
    openUpdateSheet: () => setUpdateSheetOpen(true),
    closeUpdateSheet: () => setUpdateSheetOpen(false),
    handleConfirmUpdate: (selections: UpdateOrderSelection[]) => {
      dispatch(updateOrderItems(selections));
      setUpdateSheetOpen(false);
    },
    handleProceed,
    handleBack: () => navigation.goBack(),
  };
};
