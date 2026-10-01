import type { OrderItem, ReceiptItem } from '../../../types';

export interface OrderItemGroupProps {
  /** e.g. "Cylinders to Deliver", "Empty Cylinders Collected". */
  title: string;
  /** Order lines (open orders) or receipt lines (completed ones). */
  items: Array<OrderItem | ReceiptItem>;
  /** Muted text after each quantity, e.g. "(Expected)". */
  qtySuffix?: string;
  testID?: string;
}
