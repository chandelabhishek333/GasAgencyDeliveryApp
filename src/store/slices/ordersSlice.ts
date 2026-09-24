import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { orderService } from '../../api/services/orderService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { Order, OrderListParams, OrderStatus, Paginated } from '../../types';

export type OrderStatusFilter = OrderStatus | 'all';

interface OrdersState {
  items: Order[];
  history: Order[];
  selectedOrder: Order | null;
  statusFilter: OrderStatusFilter;
  searchQuery: string;
  listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  historyStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  history: [],
  selectedOrder: null,
  statusFilter: 'all',
  searchQuery: '',
  listStatus: 'idle',
  detailStatus: 'idle',
  historyStatus: 'idle',
  error: null,
};

/** Screen 5 — the searchable/filterable order list. */
export const fetchOrders = createAsyncThunk<
  Paginated<Order>,
  OrderListParams | undefined,
  { rejectValue: string }
>('orders/fetchList', async (params, { rejectWithValue }) => {
  try {
    return await orderService.getOrders(params);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/** Screen 6 — a single order's detail. */
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

/** Screen 11 — past delivered orders. */
export const fetchOrderHistory = createAsyncThunk<
  Paginated<Order>,
  OrderListParams | undefined,
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
      .addCase(fetchOrderHistory.pending, (state) => {
        state.historyStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.historyStatus = 'succeeded';
        state.history = action.payload.items;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.historyStatus = 'failed';
        state.error = action.payload ?? 'Failed to load delivery history.';
      });
  },
});

export const { setStatusFilter, setSearchQuery, clearSelectedOrder } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
export type { OrdersState };
