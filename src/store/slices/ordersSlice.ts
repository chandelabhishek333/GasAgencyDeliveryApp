import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { orderService } from '../../api/services/orderService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { markOutForDelivery, updateOrderItems, verifyActiveDeliveryOtp } from './deliverySlice';
import type {
  CompletedDeliveryDetail,
  DeliveryHistoryPage,
  DeliveryHistoryParams,
  HistoryDeliveryEntry,
  Order,
  OrderStatus,
  Paginated,
} from '../../types';

export type OrderStatusFilter = OrderStatus | 'all';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface OrdersState {
  items: Order[];
  history: HistoryDeliveryEntry[];
  /** Total rows on the server for the current history period (for paging). */
  historyTotal: number;
  selectedOrder: Order | null;
  /** Read-only receipt for a finished delivery (Completed Order Details). */
  completedDetail: CompletedDeliveryDetail | null;
  statusFilter: OrderStatusFilter;
  searchQuery: string;
  listStatus: RequestStatus;
  detailStatus: RequestStatus;
  completedDetailStatus: RequestStatus;
  historyStatus: RequestStatus;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  history: [],
  historyTotal: 0,
  selectedOrder: null,
  completedDetail: null,
  statusFilter: 'all',
  searchQuery: '',
  listStatus: 'idle',
  detailStatus: 'idle',
  completedDetailStatus: 'idle',
  historyStatus: 'idle',
  error: null,
};

/** The Orders tab — today's deliveries, searchable/filterable client-side. */
export const fetchOrders = createAsyncThunk<Paginated<Order>, void, { rejectValue: string }>(
  'orders/fetchList',
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getOrders();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/** Order Details — an open order, read from today's deliveries (the API has no per-id GET). */
export const fetchOrderById = createAsyncThunk<Order, string, { rejectValue: string }>(
  'orders/fetchById',
  async (orderId, { rejectWithValue }) => {
    try {
      return await orderService.getOrderById(orderId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/** Completed Order Details — GET /deliveries/{id}/completed-detail. */
export const getCompletedDeliveryDetail = createAsyncThunk<CompletedDeliveryDetail, string, { rejectValue: string }>(
  'orders/getCompletedDeliveryDetail',
  async (deliveryId, { rejectWithValue }) => {
    try {
      return await orderService.getCompletedOrderDetail(deliveryId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/** Delivery History — GET /deliveries/history for one period. */
export const fetchOrderHistory = createAsyncThunk<
  DeliveryHistoryPage,
  DeliveryHistoryParams | undefined,
  { rejectValue: string }
>('orders/fetchHistory', async (params, { rejectWithValue }) => {
  try {
    return await orderService.getOrderHistory(params);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<OrderStatusFilter>) {
      state.statusFilter = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    const setStatus = (state: OrdersState, orderId: string, status: OrderStatus): void => {
      for (const order of [...state.items, state.selectedOrder]) {
        if (order && order.id === orderId) {
          order.status = status;
        }
      }
    };

    builder
      .addCase(fetchOrders.pending, (state) => {
        state.listStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload.items;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.error = action.payload ?? 'Failed to load orders.';
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.detailStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload ?? 'Failed to load order details.';
      })
      .addCase(getCompletedDeliveryDetail.pending, (state) => {
        state.completedDetailStatus = 'loading';
        state.error = null;
      })
      .addCase(getCompletedDeliveryDetail.fulfilled, (state, action) => {
        state.completedDetailStatus = 'succeeded';
        state.completedDetail = action.payload;
      })
      .addCase(getCompletedDeliveryDetail.rejected, (state, action) => {
        state.completedDetailStatus = 'failed';
        state.error = action.payload ?? 'Failed to load order details.';
      })
      .addCase(fetchOrderHistory.pending, (state) => {
        state.historyStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.historyStatus = 'succeeded';
        state.history = action.payload.items;
        state.historyTotal = action.payload.total;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.historyStatus = 'failed';
        state.error = action.payload ?? 'Failed to load delivery history.';
      })
      // Keep the Orders tab in step with the delivery flow without a refetch.
      .addCase(markOutForDelivery.fulfilled, (state, action) => {
        setStatus(state, action.meta.arg, action.payload.status);
      })
      .addCase(updateOrderItems.fulfilled, (state, action) => {
        state.items = state.items.map((order) => (order.id === action.payload.id ? action.payload : order));
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(verifyActiveDeliveryOtp.fulfilled, (state, action) => {
        setStatus(state, action.payload.deliveryId, 'completed');
      });
  },
});

export const { setStatusFilter, setSearchQuery, clearSelectedOrder } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
export type { OrdersState };
