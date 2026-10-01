import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { deliveryService } from '../../api/services/deliveryService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type {
  ConfirmDeliveryPayment,
  ConfirmDeliveryRequest,
  CylinderQuantity,
  Delivery,
  DeliveryPaymentMethod,
  DeliveryPaymentSplit,
  DeliverySummary,
  GenerateQrRequest,
  GenerateQrResponse,
  OrderItem,
  OrderStatus,
  OutForDeliveryResponse,
  VerifyCustomerOtpRequest,
  VerifyLocationRequest,
  VerifyLocationResponse,
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

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface DeliveryState {
  /** Today's assigned deliveries (Home + Orders). */
  today: Delivery[];
  /** The delivery running the out-for-delivery -> verify location -> confirm -> OTP flow. */
  activeDelivery: Delivery | null;
  /** Editable quantities and payment choices for the active delivery's Confirm step. */
  draft: DeliveryDraft | null;
  /** Driver's GPS fix sent with verify-location. */
  driverLocation: VerifyLocationRequest | null;
  /** The last verify-location answer for the active delivery. */
  locationCheck: VerifyLocationResponse | null;
  /** The dynamic UPI QR generated on Confirm Delivery; cleared whenever method, split or amount changes. */
  paymentQr: GenerateQrResponse | null;
  qrStatus: RequestStatus;
  qrError: string | null;
  /** The payment submitted with Confirm Delivery. */
  confirmedPayment: ConfirmDeliveryPayment | null;
  /** The verify-OTP receipt — what Delivery Completed shows. */
  lastCompletedSummary: DeliverySummary | null;
  todayStatus: RequestStatus;
  actionStatus: RequestStatus;
  error: string | null;
}

const initialState: DeliveryState = {
  today: [],
  activeDelivery: null,
  draft: null,
  driverLocation: null,
  locationCheck: null,
  paymentQr: null,
  qrStatus: 'idle',
  qrError: null,
  confirmedPayment: null,
  lastCompletedSummary: null,
  todayStatus: 'idle',
  actionStatus: 'idle',
  error: null,
};

/** Today's delivery list. Dashboard counts and the "next delivery" card are derived from this via selectors. */
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

/** Order Details' "Out for Delivery": pending -> out_for_delivery. */
export const markOutForDelivery = createAsyncThunk<OutForDeliveryResponse, string, { rejectValue: string }>(
  'delivery/markOutForDelivery',
  async (deliveryId, { rejectWithValue }) => {
    try {
      return await deliveryService.markOutForDelivery(deliveryId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/**
 * Start Delivery's "I'm at the Location". Rejects when the server says
 * the driver isn't there yet, so the flow can't move on to Confirm.
 */
export const verifyLocation = createAsyncThunk<
  VerifyLocationResponse,
  { deliveryId: string; location: VerifyLocationRequest },
  { rejectValue: string }
>('delivery/verifyLocation', async ({ deliveryId, location }, { rejectWithValue }) => {
  try {
    const result = await deliveryService.verifyLocation(deliveryId, location);
    if (!result.isAtLocation) {
      return rejectWithValue(
        `You're about ${Math.round(result.distanceMetersFromDestination)} m from the delivery location. Move closer and try again.`,
      );
    }
    return result;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/** Confirm Delivery's "Update Order": the server re-prices the order and answers with the recalculated delivery. */
export const updateOrderItems = createAsyncThunk<
  Delivery,
  { deliveryId: string; updatedItems: CylinderQuantity[]; reason: string },
  { rejectValue: string }
>('delivery/updateOrderItems', async ({ deliveryId, updatedItems, reason }, { rejectWithValue }) => {
  try {
    return await deliveryService.updateOrderItems(deliveryId, { updatedItems, reason });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/** Confirm Delivery's "Generate QR": a dynamic UPI QR for the full or partial amount. */
export const generatePaymentQr = createAsyncThunk<
  GenerateQrResponse,
  { deliveryId: string } & GenerateQrRequest,
  { rejectValue: string }
>('delivery/generatePaymentQr', async ({ deliveryId, amount, paymentSplit }, { rejectWithValue }) => {
  try {
    return await deliveryService.generatePaymentQr(deliveryId, { amount, paymentSplit });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/** Confirm Delivery's "Proceed to OTP" — submits delivered items, collected empties and payment. */
export const confirmActiveDelivery = createAsyncThunk<
  { deliveryId: string; customerOtpRequired: boolean },
  { deliveryId: string; payload: ConfirmDeliveryRequest },
  { rejectValue: string }
>('delivery/confirm', async ({ deliveryId, payload }, { rejectWithValue }) => {
  try {
    const result = await deliveryService.confirmDelivery(deliveryId, payload);
    return { deliveryId, customerOtpRequired: result.customerOtpRequired };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/** Customer OTP — completes the delivery; the response is the full receipt. */
export const verifyActiveDeliveryOtp = createAsyncThunk<
  DeliverySummary,
  { deliveryId: string; payload: VerifyCustomerOtpRequest },
  { rejectValue: string }
>('delivery/verifyOtp', async ({ deliveryId, payload }, { rejectWithValue }) => {
  try {
    return await deliveryService.verifyCustomerOtp(deliveryId, payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const newDraft = (delivery: Delivery): DeliveryDraft => ({
  quantities: Object.fromEntries(delivery.items.map((item) => [item.id, item.quantity])),
  notes: '',
  paymentMethod: 'cash',
  paymentSplit: 'full',
  partialAmountInput: '',
  orderUpdated: false,
});

/**
 * Draft quantities after update-items: a line whose server quantity didn't
 * change keeps what the driver entered; new or changed lines start at the
 * server's quantity. Line ids are keyed by cylinderType (see toOrder).
 */
const reseedQuantities = (
  previousItems: OrderItem[],
  previousQuantities: Record<string, number>,
  items: OrderItem[],
): Record<string, number> =>
  Object.fromEntries(
    items.map((item) => {
      const before = previousItems.find((line) => line.id === item.id);
      const entered = previousQuantities[item.id];
      return [item.id, before && before.quantity === item.quantity && entered !== undefined ? entered : item.quantity];
    }),
  );

const setStatusInToday = (state: DeliveryState, deliveryId: string, status: OrderStatus): void => {
  for (const delivery of [...state.today.filter((item) => item.id === deliveryId), state.activeDelivery]) {
    if (delivery && delivery.id === deliveryId) {
      delivery.status = status;
    }
  }
};

const clearQr = (state: DeliveryState): void => {
  state.paymentQr = null;
  state.qrStatus = 'idle';
  state.qrError = null;
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    /** Selects a delivery to run through the active-delivery flow, seeding the confirm-step draft from its quantities. */
    setActiveDelivery(state, action: PayloadAction<Delivery>) {
      state.activeDelivery = action.payload;
      state.draft = newDraft(action.payload);
      state.locationCheck = null;
      state.confirmedPayment = null;
      clearQr(state);
    },
    updateDraft(state, action: PayloadAction<Partial<Omit<DeliveryDraft, 'quantities'>>>) {
      if (state.draft) {
        state.draft = { ...state.draft, ...action.payload };
      }
    },
    /** Sets the Confirm-step quantity for one cylinder type (delivered or empty). */
    setDraftItemQuantity(state, action: PayloadAction<{ itemId: string; quantity: number }>) {
      if (state.draft) {
        state.draft.quantities[action.payload.itemId] = action.payload.quantity;
      }
    },
    setDriverLocation(state, action: PayloadAction<VerifyLocationRequest>) {
      state.driverLocation = action.payload;
    },
    /** A generated QR is for one exact amount — dropped when the method, split or amount changes. */
    clearPaymentQr(state) {
      clearQr(state);
    },
    /** Clears the active-delivery flow, e.g. after "Back to Deliveries" on Delivery Completed. */
    resetActiveDelivery(state) {
      state.activeDelivery = null;
      state.draft = null;
      state.driverLocation = null;
      state.locationCheck = null;
      state.lastCompletedSummary = null;
      state.confirmedPayment = null;
      state.actionStatus = 'idle';
      clearQr(state);
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
      .addCase(markOutForDelivery.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(markOutForDelivery.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        setStatusInToday(state, action.meta.arg, action.payload.status);
      })
      .addCase(markOutForDelivery.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload ?? 'Failed to start the delivery.';
      })
      .addCase(verifyLocation.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(verifyLocation.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.locationCheck = action.payload;
        if (state.activeDelivery) {
          state.activeDelivery.customer.isLocationCaptured = action.payload.isLocationCaptured;
        }
      })
      .addCase(verifyLocation.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload ?? 'Failed to verify location.';
      })
      .addCase(updateOrderItems.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(updateOrderItems.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        const updated = action.payload;
        if (state.activeDelivery && state.draft && state.activeDelivery.id === updated.id) {
          state.draft.quantities = reseedQuantities(state.activeDelivery.items, state.draft.quantities, updated.items);
          state.draft.orderUpdated = true;
          state.activeDelivery = updated;
        }
        state.today = state.today.map((delivery) => (delivery.id === updated.id ? updated : delivery));
        // The bill changed, so any QR already shown is for the wrong amount.
        clearQr(state);
      })
      .addCase(updateOrderItems.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload ?? 'Failed to update the order.';
      })
      .addCase(generatePaymentQr.pending, (state) => {
        state.qrStatus = 'loading';
        state.qrError = null;
      })
      .addCase(generatePaymentQr.fulfilled, (state, action) => {
        state.qrStatus = 'succeeded';
        state.paymentQr = action.payload;
      })
      .addCase(generatePaymentQr.rejected, (state, action) => {
        state.qrStatus = 'failed';
        state.qrError = action.payload ?? 'Failed to generate the QR code.';
      })
      .addCase(confirmActiveDelivery.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(confirmActiveDelivery.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.confirmedPayment = action.meta.arg.payload.payment;
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
        setStatusInToday(state, action.payload.deliveryId, 'completed');
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
  setDriverLocation,
  clearPaymentQr,
  resetActiveDelivery,
} = deliverySlice.actions;
export const deliveryReducer = deliverySlice.reducer;
export type { DeliveryState };
