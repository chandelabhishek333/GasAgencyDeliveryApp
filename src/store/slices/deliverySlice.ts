import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { deliveryService } from '../../api/services/deliveryService';
import { cylinderSizeKey, emptyLabelFor } from '../../utils/cylinderSize';
import { getDeliveryTotals } from '../../utils/deliveryTotals';
import { getPayableAmount } from '../../utils/getPayableAmount';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type {
  Delivery,
  DeliveryConfirmRequest,
  DeliveryPaymentCollection,
  DeliveryPaymentMethod,
  DeliveryPaymentSplit,
  DeliveryStartRequest,
  DeliverySummary,
  DeliverySummaryItem,
  OrderItemKind,
  VerifyCustomerOtpRequest,
} from '../../types';

export interface DeliveryDraft {
  /** Confirm-step quantity per order line, keyed by OrderItem.id — one entry per cylinder type delivered and per empty type collected. */
  quantities: Record<string, number>;
  notes: string;
  paymentMethod: DeliveryPaymentMethod;
  paymentSplit: DeliveryPaymentSplit;
  /** Raw text of the partial-amount input; parsed and validated on Proceed. */
  partialAmountInput: string;
  /** True once the driver changed the order's cylinder types/quantities via "Update Order". */
  orderUpdated: boolean;
}

interface DeliveryState {
  /** Today's assigned deliveries (Screens 4 & 5). */
  today: Delivery[];
  /** The delivery currently running the Start -> Confirm -> OTP -> Complete flow (Screens 7-10). */
  activeDelivery: Delivery | null;
  /** Editable quantities for the active delivery's Confirm step (Screen 8). */
  draft: DeliveryDraft | null;
  /**
   * Driver's device coordinates captured on Screen 7's "I'm at the
   * Location" tap (see utils/getCurrentLocation.ts) — kept separate
   * from `activeDelivery` (typed as the shared `Order`/`Delivery`
   * model) rather than nested under it, so this delivery-flow-only
   * runtime value doesn't leak into that shared type.
   */
  driverLocation: DeliveryStartRequest | null;
  lastCompletedSummary: DeliverySummary | null;
  /**
   * The payment submitted with Confirm Delivery (method + full/partial
   * amount) — what the OTP step, and a dynamic-QR screen once one
   * exists, read to know how much to collect and how.
   */
  confirmedPayment: DeliveryPaymentCollection | null;
  todayStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  actionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DeliveryState = {
  today: [],
  activeDelivery: null,
  draft: null,
  driverLocation: null,
  lastCompletedSummary: null,
  confirmedPayment: null,
  todayStatus: 'idle',
  actionStatus: 'idle',
  error: null,
};

/** Screens 4 & 5 — today's delivery list. Dashboard counts and the "next delivery" card are derived from this via selectors, not fetched separately. */
export const fetchTodayDeliveries = createAsyncThunk<Delivery[], void, { rejectValue: string }>(
  'delivery/fetchToday',
  async (_, { rejectWithValue }) => {
    try {
      return await deliveryService.getTodayDeliveries();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/**
 * The delivery-execution endpoints (start/confirm/verify-otp) aren't
 * live on the backend yet — unlike auth/today/order-detail, which are.
 * A real (non-network) error response from them bypasses
 * errorInterceptor's network-only mock fallback, which would otherwise
 * dead-end Screens 7-10. In dev, any failure here is treated as "not
 * implemented yet" and resolved locally instead, so the flow stays
 * testable end-to-end. Delete each `if (__DEV__)` block below once its
 * endpoint ships for real — the thunk then just rejects normally.
 */

/** Screen 7 — confirms the driver is at the delivery location. */
export const startActiveDelivery = createAsyncThunk<
  { deliveryId: string; isAtLocation: boolean },
  { deliveryId: string; location: DeliveryStartRequest },
  { rejectValue: string }
>('delivery/start', async ({ deliveryId, location }, { rejectWithValue }) => {
  try {
    const result = await deliveryService.startDelivery(deliveryId, location);
    return { deliveryId, isAtLocation: result.isAtLocation };
  } catch (error) {
    if (__DEV__) {
      return { deliveryId, isAtLocation: true };
    }
    return rejectWithValue(getErrorMessage(error));
  }
});

/** Screen 8 — submits delivered/collected quantities. */
export const confirmActiveDelivery = createAsyncThunk<
  { deliveryId: string; customerOtpRequired: boolean },
  { deliveryId: string; payload: DeliveryConfirmRequest },
  { rejectValue: string }
>('delivery/confirm', async ({ deliveryId, payload }, { rejectWithValue }) => {
  try {
    const result = await deliveryService.confirmDelivery(deliveryId, payload);
    return { deliveryId, customerOtpRequired: result.customerOtpRequired };
  } catch (error) {
    if (__DEV__) {
      return { deliveryId, customerOtpRequired: true };
    }
    return rejectWithValue(getErrorMessage(error));
  }
});

/** Receipt lines for one item kind: the confirm-step quantity per cylinder type, skipping types with none. */
const getSummaryItems = (
  delivery: Delivery,
  draft: DeliveryDraft | null,
  kind: OrderItemKind,
): DeliverySummaryItem[] =>
  delivery.items
    .filter((item) => item.kind === kind)
    .map((item) => ({ label: item.label, quantity: draft?.quantities[item.id] ?? item.quantity }))
    .filter((item) => item.quantity > 0);

/**
 * The receipt's per-type breakdown and collected payment, built from
 * the delivery in progress — the app's own record of what the driver
 * confirmed.
 */
const getLocalReceiptDetails = (
  state: DeliveryState,
  delivery: Delivery,
): Pick<DeliverySummary, 'deliveredItems' | 'emptyItems' | 'payment'> => ({
  deliveredItems: getSummaryItems(delivery, state.draft, 'cylinderDelivery'),
  emptyItems: getSummaryItems(delivery, state.draft, 'emptyCollection'),
  payment: state.confirmedPayment ?? undefined,
});

/**
 * Screen 9 — verifies the customer-facing OTP that closes out the
 * delivery. The live response isn't confirmed to carry the per-type
 * breakdown or payment, so any it leaves out are filled from the
 * delivery in progress.
 */
export const verifyActiveDeliveryOtp = createAsyncThunk<
  DeliverySummary,
  { deliveryId: string; payload: VerifyCustomerOtpRequest },
  { state: { delivery: DeliveryState }; rejectValue: string }
>('delivery/verifyOtp', async ({ deliveryId, payload }, { getState, rejectWithValue }) => {
  const state = getState().delivery;
  const { activeDelivery, draft } = state;
  try {
    const summary = await deliveryService.verifyCustomerOtp(deliveryId, payload);
    if (!activeDelivery) {
      return summary;
    }
    const local = getLocalReceiptDetails(state, activeDelivery);
    return {
      ...summary,
      deliveredItems: summary.deliveredItems ?? local.deliveredItems,
      emptyItems: summary.emptyItems ?? local.emptyItems,
      payment: summary.payment ?? local.payment,
    };
  } catch (error) {
    if (__DEV__) {
      // Any 4-digit OTP is accepted (CustomerOTPScreen only checks
      // length) — build the summary from the delivery already in
      // progress rather than round-tripping through a live endpoint.
      if (activeDelivery) {
        const totals = getDeliveryTotals(activeDelivery.items, draft?.quantities ?? {});
        return {
          deliveryId,
          orderNumber: activeDelivery.orderNumber,
          deliveredQuantity: totals.delivered,
          emptyCollectedQuantity: totals.collected,
          completedAt: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
          ...getLocalReceiptDetails(state, activeDelivery),
        };
      }
    }
    return rejectWithValue(getErrorMessage(error));
  }
});

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    /** Selects a delivery (from `today`) to run through the active-delivery flow, seeding the confirm-step draft from its ordered quantities. */
    setActiveDelivery(state, action: PayloadAction<Delivery>) {
      state.activeDelivery = action.payload;
      state.draft = {
        quantities: Object.fromEntries(action.payload.items.map((item) => [item.id, item.quantity])),
        notes: '',
        paymentMethod: 'cash',
        paymentSplit: 'full',
        partialAmountInput: '',
        orderUpdated: false,
      };
      state.confirmedPayment = null;
    },
    updateDraft(state, action: PayloadAction<Partial<Omit<DeliveryDraft, 'quantities'>>>) {
      if (state.draft) {
        state.draft = { ...state.draft, ...action.payload };
      }
    },
    /**
     * Confirm Delivery's "Update Order": applies the sheet's full set of
     * counts (one entry per catalog type) to the active delivery in one go.
     * Per type, matched by size (e.g. "19 KG"):
     *  - count > 0 and already in the order -> its delivered line and 1-to-1
     *    empty line (and their draft quantities) take the new count;
     *  - count > 0 and new -> a delivered + empty line pair is added;
     *  - count 0 and in the order -> both lines are removed.
     * Order lines with no size in their label aren't in the catalog and are
     * left untouched. The payable amount moves by (new - current) × rate
     * per type, so repeated updates stay consistent.
     */
    updateOrderItems(state, action: PayloadAction<Array<{ label: string; quantity: number; unitPrice: number }>>) {
      const delivery = state.activeDelivery;
      const draft = state.draft;
      if (!delivery || !draft) {
        return;
      }
      let amountDelta = 0;
      let changed = false;
      for (const { label, quantity, unitPrice } of action.payload) {
        const size = cylinderSizeKey(label);
        if (size === null) {
          continue;
        }
        const cylinder = delivery.items.find(
          (item) => item.kind === 'cylinderDelivery' && cylinderSizeKey(item.label) === size,
        );
        const empty = delivery.items.find(
          (item) => item.kind === 'emptyCollection' && cylinderSizeKey(item.label) === size,
        );
        const currentQuantity = cylinder?.quantity ?? 0;
        if (quantity === currentQuantity) {
          continue;
        }
        amountDelta += (quantity - currentQuantity) * unitPrice;
        changed = true;

        if (quantity === 0) {
          delivery.items = delivery.items.filter((item) => item !== cylinder && item !== empty);
          for (const removed of [cylinder, empty]) {
            if (removed) {
              delete draft.quantities[removed.id];
            }
          }
          continue;
        }
        const cylinderLine = cylinder ?? { id: `${delivery.id}-added-${size}`, kind: 'cylinderDelivery' as const, label, quantity };
        const emptyLine =
          empty ?? { id: `${cylinderLine.id}-empty`, kind: 'emptyCollection' as const, label: emptyLabelFor(label), quantity };
        cylinderLine.quantity = quantity;
        emptyLine.quantity = quantity;
        if (!cylinder) {
          delivery.items.push(cylinderLine);
        }
        if (!empty) {
          delivery.items.push(emptyLine);
        }
        draft.quantities[cylinderLine.id] = quantity;
        draft.quantities[emptyLine.id] = quantity;
      }
      if (changed) {
        delivery.payableAmount = Math.max(0, getPayableAmount(delivery) + amountDelta);
        draft.orderUpdated = true;
      }
    },
    /** Sets the Confirm-step quantity for one cylinder type (delivered or empty). */
    setDraftItemQuantity(state, action: PayloadAction<{ itemId: string; quantity: number }>) {
      if (state.draft) {
        state.draft.quantities[action.payload.itemId] = action.payload.quantity;
      }
    },
    setDriverLocation(state, action: PayloadAction<DeliveryStartRequest>) {
      state.driverLocation = action.payload;
    },
    /** Clears the active-delivery flow, e.g. after "Back to Deliveries" on Screen 10. */
    resetActiveDelivery(state) {
      state.activeDelivery = null;
      state.draft = null;
      state.driverLocation = null;
      state.lastCompletedSummary = null;
      state.confirmedPayment = null;
      state.actionStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayDeliveries.pending, (state) => {
        state.todayStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchTodayDeliveries.fulfilled, (state, action) => {
        state.todayStatus = 'succeeded';
        state.today = action.payload;
      })
      .addCase(fetchTodayDeliveries.rejected, (state, action) => {
        state.todayStatus = 'failed';
        state.error = action.payload ?? "Failed to load today's deliveries.";
      })
      .addCase(startActiveDelivery.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(startActiveDelivery.fulfilled, (state) => {
        state.actionStatus = 'succeeded';
      })
      .addCase(startActiveDelivery.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload ?? 'Failed to verify location.';
      })
      .addCase(confirmActiveDelivery.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(confirmActiveDelivery.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.confirmedPayment = action.meta.arg.payload.payment ?? null;
      })
      .addCase(confirmActiveDelivery.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload ?? 'Failed to confirm delivery.';
      })
      .addCase(verifyActiveDeliveryOtp.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(verifyActiveDeliveryOtp.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.lastCompletedSummary = action.payload;
        state.today = state.today.filter((delivery) => delivery.id !== action.payload.deliveryId);
      })
      .addCase(verifyActiveDeliveryOtp.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload ?? 'Invalid customer OTP.';
      });
  },
});

export const {
  setActiveDelivery,
  updateDraft,
  setDraftItemQuantity,
  updateOrderItems,
  setDriverLocation,
  resetActiveDelivery,
} = deliverySlice.actions;
export const deliveryReducer = deliverySlice.reducer;
export type { DeliveryState };
