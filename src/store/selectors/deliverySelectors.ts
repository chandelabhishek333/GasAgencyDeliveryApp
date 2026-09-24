import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export const selectDeliveryState = (state: RootState): RootState['delivery'] => state.delivery;
export const selectTodayDeliveries = (state: RootState) => state.delivery.today;
export const selectActiveDelivery = (state: RootState) => state.delivery.activeDelivery;
export const selectDeliveryDraft = (state: RootState) => state.delivery.draft;
export const selectDriverLocation = (state: RootState) => state.delivery.driverLocation;
export const selectLastCompletedSummary = (state: RootState) => state.delivery.lastCompletedSummary;
export const selectTodayStatus = (state: RootState) => state.delivery.todayStatus;
export const selectDeliveryActionStatus = (state: RootState) => state.delivery.actionStatus;
export const selectDeliveryError = (state: RootState) => state.delivery.error;

/** Screen 4's "Today's Deliveries" status breakdown (Pending/In Progress/Completed). */
export const selectDeliveryStats = createSelector(selectTodayDeliveries, (deliveries) => ({
  total: deliveries.length,
  pending: deliveries.filter((delivery) => delivery.status === 'pending').length,
  inProgress: deliveries.filter((delivery) => delivery.status === 'in_progress').length,
  completed: deliveries.filter((delivery) => delivery.status === 'completed').length,
}));

/** Screen 4's "Next Delivery" card — the earliest still-pending delivery. */
export const selectNextDelivery = createSelector(
  selectTodayDeliveries,
  (deliveries) => deliveries.find((delivery) => delivery.status === 'pending') ?? null,
);
