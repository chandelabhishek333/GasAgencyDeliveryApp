import type { Order } from '../../../types';

export interface OrderCardProps {
  order: Order;
  onPress?: (order: Order) => void;
  testID?: string;
}
