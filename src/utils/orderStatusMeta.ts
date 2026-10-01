import type { OrderStatus } from '../types';
import type { BadgeVariant } from '../components/common/Badge/types';

/** Shared display mapping for OrderStatus — used by OrderCard, Order Details and Completed Order Details. */
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pending',
  out_for_delivery: 'Out for Delivery',
  completed: 'Completed',
  failed: 'Failed',
};

export const ORDER_STATUS_BADGE_VARIANT: Record<OrderStatus, BadgeVariant> = {
  pending: 'pending',
  out_for_delivery: 'inProgress',
  completed: 'completed',
  failed: 'failed',
};
