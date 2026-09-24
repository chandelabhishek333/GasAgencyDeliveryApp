import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { deliveryService } from '../../api/services/deliveryService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type {
  Delivery,
  DeliveryConfirmRequest,
  DeliveryStartRequest,
  DeliverySummary,
  VerifyCustomerOtpRequest,
} from '../../types';

export interface DeliveryDraft {
  deliveredQuantity: number;
  emptyCollectedQuantity: number;
  notes: string;
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

/** Screen 9 — verifies the customer-facing OTP that closes out the delivery. */
export const verifyActiveDeliveryOtp = createAsyncThunk<
  DeliverySummary,
  { deliveryId: string; payload: VerifyCustomerOtpRequest },
  { state: { delivery: DeliveryState }; rejectValue: string }
>('delivery/verifyOtp', async ({ deliveryId, payload }, { getState, rejectWithValue }) => {
  try {
    return await deliveryService.verifyCustomerOtp(deliveryId, payload);
  } catch (error) {
    if (__DEV__) {
      // Any 4-digit OTP is accepted (CustomerOTPScreen only checks
      // length) — build the summary from the delivery already in
      // progress rather than round-tripping through a live endpoint.
      const { activeDelivery, draft } = getState().delivery;
      if (activeDelivery) {
        return {
          deliveryId,
          orderNumber: activeDelivery.orderNumber,
          deliveredQuantity: draft?.deliveredQuantity ?? 0,
          emptyCollectedQuantity: draft?.emptyCollectedQuantity ?? 0,
          completedAt: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
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
      const cylinderItem = action.payload.items.find((item) => item.kind === 'cylinderDelivery');
      const emptyItem = action.payload.items.find((item) => item.kind === 'emptyCollection');
      state.draft = {
        deliveredQuantity: cylinderItem?.quantity ?? 0,
        emptyCollectedQuantity: emptyItem?.quantity ?? 0,
        notes: '',
      };
    },
    updateDraft(state, action: PayloadAction<Partial<DeliveryDraft>>) {
      if (state.draft) {
        state.draft = { ...state.draft, ...action.payload };
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
      .addCase(confirmActiveDelivery.fulfilled, (state) => {
        state.actionStatus = 'succeeded';
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

export const { setActiveDelivery, updateDraft, setDriverLocation, resetActiveDelivery } =
  deliverySlice.actions;
export const deliveryReducer = deliverySlice.reducer;
export type { DeliveryState };
