import type { StyleProp, ViewStyle } from 'react-native';

export type BadgeVariant = 'pending' | 'inProgress' | 'completed' | 'failed' | 'delivered' | 'info';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Adds a trailing "›" — used for tappable status badges (e.g. the order list). */
  showChevron?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
