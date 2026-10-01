import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export const selectOrdersState = (state: RootState): RootState['orders'] => state.orders;
export const selectOrders = (state: RootState) => state.orders.items;
export const selectOrderHistory = (state: RootState) => state.orders.history;
export const selectSelectedOrder = (state: RootState) => state.orders.selectedOrder;
export const selectOrderStatusFilter = (state: RootState) => state.orders.statusFilter;
export const selectOrderSearchQuery = (state: RootState) => state.orders.searchQuery;
export const selectOrdersListStatus = (state: RootState) => state.orders.listStatus;
export const selectOrderDetailStatus = (state: RootState) => state.orders.detailStatus;
export const selectOrderHistoryStatus = (state: RootState) => state.orders.historyStatus;
export const selectOrdersError = (state: RootState) => state.orders.error;

/** Screen 5 — applies the active status filter + search query client-side. */
export const selectFilteredOrders = createSelector(
  [selectOrders, selectOrderStatusFilter, selectOrderSearchQuery],
  (orders, statusFilter, searchQuery) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        order.customerName.toLowerCase().includes(normalizedQuery) ||
        order.orderNumber.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  },
);

/** Screen 5's filter-tab counts: "All (12)", "Pending (8)", "Out for Delivery (2)", "Completed (2)". */
export const selectOrderStatusCounts = createSelector(selectOrders, (orders) => ({
  all: orders.length,
  pending: orders.filter((order) => order.status === 'pending').length,
  inProgress: orders.filter((order) => order.status === 'in_progress').length,
  completed: orders.filter((order) => order.status === 'completed').length,
}));
