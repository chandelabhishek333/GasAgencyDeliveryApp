import React, { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../theme';
import { styles } from './styles';
import type { ToastProps, ToastVariant } from './types';

const CONTAINER_STYLE_BY_VARIANT: Record<ToastVariant, ViewStyle> = {
  success: styles.success,
  error: styles.error,
  info: styles.info,
};

const ICON_NAME_BY_VARIANT: Record<ToastVariant, string> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
};

const ICON_COLOR_BY_VARIANT: Record<ToastVariant, string> = {
  success: Colors.successGreen,
  error: Colors.errorRed,
  info: Colors.infoText,
};

const ICON_SIZE = 22;

/**
 * Floating success/error/info snackbar — a white card with a colored
 * left accent border and matching icon (text stays neutral dark slate
 * for every variant). Renders nothing while `visible` is false.
 * `position="top"` docks it just below the status bar (via
 * `useSafeAreaInsets`) rather than under a fixed offset, so it never
 * collides with the clock/battery icons on any device.
 */
export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  variant = 'info',
  position = 'bottom',
  duration,
  onDismiss,
  testID,
}) => {
  const insets = useSafeAreaInsets();

  // Held in a ref so a parent re-rendering with a fresh (non-memoized)
  // `onDismiss` — e.g. OTPVerification's 1s countdown — doesn't restart
  // the timer on every tick and keep the toast up forever. The timer
  // restarts only when the toast is shown or its message changes.
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!visible || !duration) {
      return undefined;
    }
    const timer = setTimeout(() => onDismissRef.current?.(), duration);
    return () => clearTimeout(timer);
  }, [visible, duration, message]);

  if (!visible) {
    return null;
  }

  const positionStyle = position === 'top' ? { top: insets.top + 12 } : styles.positionBottom;

  return (
    <View style={[styles.container, positionStyle, CONTAINER_STYLE_BY_VARIANT[variant]]} testID={testID}>
      <Ionicons name={ICON_NAME_BY_VARIANT[variant]} size={ICON_SIZE} color={ICON_COLOR_BY_VARIANT[variant]} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};
