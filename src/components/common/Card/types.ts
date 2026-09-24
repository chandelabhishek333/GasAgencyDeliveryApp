import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface CardProps {
  children: ReactNode;
  /** Overrides the default padding (Spacing.md on all sides). */
  padding?: number;
  noBorder?: boolean;
  noShadow?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
