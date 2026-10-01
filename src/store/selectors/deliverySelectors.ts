import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export const selectDeliveryState = (state: RootState): RootState['delivery'] => state.delivery;
export const selectTodayDeliveries = (state: RootState) => state.delivery.today;
export const selectActiveDelivery = (state: RootState) => state.delivery.activeDelivery;
export const selectDeliveryDraft = (state: RootState) => state.delivery.draft;
export const selectDriverLocation = (state: RootState) => state.delivery.driverLocation;
export const selectLocationCheck = (state: RootState) => state.delivery.locationCheck;
export const selectPaymentQr = (state: RootState) => state.delivery.paymentQr;
export const selectPaymentQrStatus = (state: RootState) => state.delivery.qrStatus;
export const selectPaymentQrError = (state: RootState) => state.delivery.qrError;
export const selectLastCompletedSummary = (state: RootState) => state.delivery.lastCompletedSummary;
/** The payment submitted with Confirm Delivery. */
export const selectConfirmedPayment = (state: RootState) => state.delivery.confirmedPayment;
export const selectTodayStatus = (state: RootState) => state.delivery.todayStatus;
export const selectDeliveryActionStatus = (state: RootState) => state.delivery.actionStatus;
export const selectDeliveryError = (state: RootState) => state.delivery.error;

/** Home's "Today's Deliveries" status breakdown (Pending/Out for Delivery/Completed). */
export const selectDeliveryStats = createSelector(selectTodayDeliveries, (deliveries) => ({
  total: deliveries.length,
  pending: deliveries.filter((delivery) => delivery.status === 'pending').length,
  outForDelivery: deliveries.filter((delivery) => delivery.status === 'out_for_delivery').length,
  completed: deliveries.filter((delivery) => delivery.status === 'completed').length,
}));

/** Screen 4's "Next Delivery" card — the earliest still-pending delivery. */
export const selectNextDelivery = createSelector(
  selectTodayDeliveries,
  (deliveries) => deliveries.find((delivery) => delivery.status === 'pending') ?? null,
);
