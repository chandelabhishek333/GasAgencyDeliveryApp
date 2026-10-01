import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  clearPaymentQr,
  confirmActiveDelivery,
  generatePaymentQr,
  setDraftItemQuantity,
  updateDraft,
  updateOrderItems,
} from '../../../store/slices/deliverySlice';
import type { UpdateOrderSelection } from '../../../components/delivery/UpdateOrderSheet/types';
import {
  selectActiveDelivery,
  selectDeliveryActionStatus,
  selectDeliveryDraft,
  selectDeliveryError,
  selectPaymentQr,
  selectPaymentQrError,
  selectPaymentQrStatus,
} from '../../../store/selectors/deliverySelectors';
import { ROUTES } from '../../../constants/routes';
import { getDeliveryTotals } from '../../../utils/deliveryTotals';
import { formatRupees } from '../../../utils/formatRupees';
import { toApiPaymentMethod } from '../../../utils/paymentMeta';
import type {
  ConfirmDeliveryRequest,
  DeliveryPaymentMethod,
  DeliveryPaymentSplit,
  OrderItem,
} from '../../../types';
import type { DeliveryProofScreenProps } from './types';

/** Keeps digits and a single decimal point with at most 2 decimals (paise). */
const sanitizeAmountInput = (text: string): string => {
  const [whole, ...fraction] = text.replace(/[^0-9.]/g, '').split('.');
  return fraction.length === 0 ? whole : `${whole}.${fraction.join('').slice(0, 2)}`;
};

/** Rupee amounts to paise precision, so payable - collected never leaves float dust. */
const roundRupees = (amount: number): number => Math.round(amount * 100) / 100;

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

/**
 * update-items needs a `reason`; the sheet has no reason field, so it's the
 * change itself: "Updated at doorstep: 19 KG Commercial 4 → 5; 5 KG Domestic added (1)".
 */
const describeOrderUpdate = (current: OrderItem[], selections: UpdateOrderSelection[]): string => {
  const changes = selections.flatMap(({ cylinderType, label, quantity }) => {
    const before = current.find((item) => item.cylinderType === cylinderType)?.quantity ?? 0;
    if (before === quantity) {
      return [];
    }
    if (before === 0) {
      return [`${label} added (${quantity})`];
    }
    return [quantity === 0 ? `${label} removed` : `${label} ${before} → ${quantity}`];
  });
  return `Updated at doorstep: ${changes.join('; ')}`;
};

export const useDeliveryProof = (navigation: DeliveryProofScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const activeDelivery = useAppSelector(selectActiveDelivery);
  const draft = useAppSelector(selectDeliveryDraft);
  const actionStatus = useAppSelector(selectDeliveryActionStatus);
  const error = useAppSelector(selectDeliveryError);
  const paymentQr = useAppSelector(selectPaymentQr);
  const qrStatus = useAppSelector(selectPaymentQrStatus);
  const qrError = useAppSelector(selectPaymentQrError);
  // Only flags an *empty* partial amount, and only once Proceed was tapped.
  const [proceedAttempted, setProceedAttempted] = useState(false);
  const [isUpdateSheetOpen, setUpdateSheetOpen] = useState(false);

  const items = activeDelivery?.items ?? [];
  const quantities = draft?.quantities ?? {};
  const cylinderItems = items.filter((item) => item.kind === 'cylinderDelivery');
  const emptyItems = items.filter((item) => item.kind === 'emptyCollection');
  const totals = getDeliveryTotals(items, quantities);

  const payableAmount = activeDelivery?.billing.totalPayableAmount ?? 0;
  const paymentMethod = draft?.paymentMethod ?? 'cash';
  const paymentSplit = draft?.paymentSplit ?? 'full';
  const partialAmountInput = draft?.partialAmountInput ?? '';
  const partial = parsePartialAmount(partialAmountInput, payableAmount);
  // Amount a QR is generated for: the full payable, or a valid partial amount.
  const qrAmount = paymentSplit === 'full' ? payableAmount : partial.amount;
  const partialAmountError =
    paymentSplit !== 'partial'
      ? null
      : partial.error ?? (proceedAttempted && !partialAmountInput ? 'Enter the partial amount to collect.' : null);

  // A generated QR encodes one exact amount — any change to method, split or amount drops it.
  useEffect(() => {
    dispatch(clearPaymentQr());
  }, [dispatch, paymentMethod, paymentSplit, qrAmount]);

  const handleGenerateQr = (): void => {
    if (activeDelivery && qrAmount !== null) {
      dispatch(generatePaymentQr({ deliveryId: activeDelivery.id, amount: qrAmount, paymentSplit }));
    }
  };

  const handleConfirmUpdate = async (selections: UpdateOrderSelection[]): Promise<void> => {
    if (!activeDelivery) {
      return;
    }
    try {
      await dispatch(
        updateOrderItems({
          deliveryId: activeDelivery.id,
          updatedItems: selections
            .filter((item) => item.quantity > 0)
            .map(({ cylinderType, quantity }) => ({ cylinderType, quantity })),
          reason: describeOrderUpdate(cylinderItems, selections),
        }),
      ).unwrap();
    } catch {
      // deliverySlice.error already reflects the failure (shown above the footer button).
    }
    setUpdateSheetOpen(false);
  };

  const handleProceed = async (): Promise<void> => {
    if (!activeDelivery || !draft) {
      return;
    }
    setProceedAttempted(true);
    const amountCollected = draft.paymentSplit === 'full' ? payableAmount : partial.amount;
    if (amountCollected === null) {
      return;
    }
    const payload: ConfirmDeliveryRequest = {
      deliveredItems: cylinderItems
        .map((item) => ({ cylinderType: item.cylinderType, quantity: quantities[item.id] ?? item.quantity }))
        .filter((item) => item.quantity > 0),
      // Every expected type, 0 included, so the server can add what wasn't returned to the customer's due.
      collectedEmpties: emptyItems.map((item) => ({ cylinderType: item.cylinderType, quantity: quantities[item.id] ?? 0 })),
      payment: {
        method: toApiPaymentMethod(draft.paymentMethod),
        split: draft.paymentSplit,
        amountCollected,
        payableAmount,
        pendingBalance: roundRupees(Math.max(0, payableAmount - amountCollected)),
      },
      driverNotes: draft.notes.trim() || undefined,
    };
    try {
      await dispatch(confirmActiveDelivery({ deliveryId: activeDelivery.id, payload })).unwrap();
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
    error: actionStatus === 'failed' ? error : null,
    setItemQuantity: (itemId: string, quantity: number) => dispatch(setDraftItemQuantity({ itemId, quantity })),
    setNotes: (notes: string) => dispatch(updateDraft({ notes })),
    setPaymentMethod: (method: DeliveryPaymentMethod) => dispatch(updateDraft({ paymentMethod: method })),
    setPaymentSplit: (split: DeliveryPaymentSplit) => dispatch(updateDraft({ paymentSplit: split })),
    setPartialAmountInput: (text: string) =>
      dispatch(updateDraft({ partialAmountInput: sanitizeAmountInput(text) })),
    qrAmount,
    paymentQr,
    isGeneratingQr: qrStatus === 'loading',
    qrError,
    handleGenerateQr,
    isUpdateSheetOpen,
    openUpdateSheet: () => setUpdateSheetOpen(true),
    closeUpdateSheet: () => setUpdateSheetOpen(false),
    handleConfirmUpdate,
    handleProceed,
    handleBack: () => navigation.goBack(),
  };
};
