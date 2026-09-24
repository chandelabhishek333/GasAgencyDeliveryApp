import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface HeaderProps {
  title?: string;
  /** Shows the back arrow when provided. */
  onBackPress?: () => void;
  rightIcon?: ReactNode;
  rightLabel?: string;
  onRightPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
