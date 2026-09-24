import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';
import type { QuantityStepperProps } from './types';

/** Minus / value / plus control used on Confirm Delivery's quantity rows. */
export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  testID,
}) => {
  const canDecrement = value - step >= min;
  const canIncrement = max === undefined || value + step <= max;

  return (
    <View style={styles.row} testID={testID}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - step))}
        disabled={!canDecrement}
        style={[styles.button, styles.minusButton, !canDecrement && styles.buttonDisabled]}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <Text style={[styles.buttonLabel, styles.minusLabel]}>−</Text>
      </Pressable>

      <Text style={styles.value}>{value}</Text>

      <Pressable
        onPress={() => onChange(max !== undefined ? Math.min(max, value + step) : value + step)}
        disabled={!canIncrement}
        style={[styles.button, styles.plusButton, !canIncrement && styles.buttonDisabled]}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <Text style={[styles.buttonLabel, styles.plusLabel]}>+</Text>
      </Pressable>
    </View>
  );
};
