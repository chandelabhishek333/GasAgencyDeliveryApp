import type { OrderItem } from '../../../types';

export interface OrderItemGroupProps {
  /** e.g. "Cylinders to Deliver", "Empty Cylinders Collected". */
  title: string;
  items: OrderItem[];
  /** Muted text after each quantity, e.g. "(Expected)". */
  qtySuffix?: string;
  testID?: string;
}
