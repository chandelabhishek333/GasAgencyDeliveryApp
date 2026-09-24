import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../theme';
import { styles } from './styles';
import type { ToastProps, ToastVariant } from './types';

const CONTAINER_STYLE_BY_VARIANT: Record<ToastVariant, ViewStyle> = {
  success: styles.success,
  error: styles.error,
  info: styles.info,
};

const ICON_NAME_BY_VARIANT: Record<ToastVariant, keyof typeof Ionicons.glyphMap> = {
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

  useEffect(() => {
    if (!visible || !duration || !onDismiss) {
      return undefined;
    }
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onDismiss]);

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
