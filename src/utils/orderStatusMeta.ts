import type { OrderStatus } from '../types';
import type { BadgeVariant } from '../components/common/Badge/types';

/** Shared display mapping for OrderStatus — used by OrderCard, Order Details and Completed Order Details. */
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pending',
  in_progress: 'Out for Delivery',
  completed: 'Completed',
  failed: 'Failed',
};

export const ORDER_STATUS_BADGE_VARIANT: Record<OrderStatus, BadgeVariant> = {
  pending: 'pending',
  in_progress: 'inProgress',
  completed: 'completed',
  failed: 'failed',
};
