import type { OrderStatus } from '../types';
import type { BadgeVariant } from '../components/common/Badge/types';

/** Shared display mapping for OrderStatus — used by OrderCard and Order Detail. */
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export const ORDER_STATUS_BADGE_VARIANT: Record<OrderStatus, BadgeVariant> = {
  pending: 'pending',
  in_progress: 'inProgress',
  completed: 'completed',
};
