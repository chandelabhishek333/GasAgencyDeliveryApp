import type { ReactNode } from 'react';
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

/**
 * `primary` renders the brand orange (the app's dominant CTA color
 * across screens); `secondary` renders the brand blue. Naming follows
 * the design system's own Button spec, not the `Colors.primary`/
 * `Colors.secondary` brand-color names — the mapping is intentionally
 * inverted (primary action = orange = `Colors.secondary`).
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
