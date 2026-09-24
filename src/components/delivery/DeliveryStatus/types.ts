import type { OrderStatus } from '../../../types';

export interface DeliveryStatusStep {
  key: OrderStatus;
  label: string;
}

export interface DeliveryStatusProps {
  status: OrderStatus;
  /** Defaults to Pending -> In Progress -> Completed. */
  steps?: DeliveryStatusStep[];
  testID?: string;
}
