import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import { Colors } from '../../../theme';
import { styles } from './styles';
import type { ButtonProps, ButtonSize, ButtonVariant } from './types';

const CONTAINER_STYLE_BY_VARIANT: Record<ButtonVariant, ViewStyle> = {
  primary: styles.primary,
  secondary: styles.secondary,
  outline: styles.outline,
  text: styles.text,
};

const CONTAINER_STYLE_BY_SIZE: Record<ButtonSize, ViewStyle> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const LABEL_STYLE_BY_VARIANT: Record<ButtonVariant, TextStyle> = {
  primary: styles.primaryLabel,
  secondary: styles.secondaryLabel,
  outline: styles.outlineLabel,
  text: styles.textLabel,
};

const LABEL_STYLE_BY_SIZE: Record<ButtonSize, TextStyle> = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
};

const SPINNER_COLOR_BY_VARIANT: Record<ButtonVariant, string> = {
  primary: Colors.white,
  secondary: Colors.white,
  outline: Colors.primary,
  text: Colors.primary,
};

/**
 * Primary CTA building block. `variant="primary"` renders the brand
 * orange used for most calls to action; `variant="secondary"` the
 * brand blue. See types.ts for the naming rationale.
 */
export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  style,
  testID,
}) => {
  const isDisabled = disabled || loading;
  // Dim the button's own variant color rather than swapping to a flat
  // gray — a loading solid button keeps full color with a spinner, and
  // a disabled one (invalid input, not yet complete) reads as a faded
  // version of its normal color (faded orange / faded blue).
  const showDimmed = disabled && !loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        CONTAINER_STYLE_BY_VARIANT[variant],
        CONTAINER_STYLE_BY_SIZE[size],
        fullWidth && styles.fullWidth,
        showDimmed && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={SPINNER_COLOR_BY_VARIANT[variant]} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          <Text style={[styles.label, LABEL_STYLE_BY_SIZE[size], LABEL_STYLE_BY_VARIANT[variant]]}>
            {label}
          </Text>
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
};
