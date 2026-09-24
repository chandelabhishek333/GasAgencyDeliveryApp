import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusButton: {
    backgroundColor: Colors.bgLight,
  },
  plusButton: {
    backgroundColor: Colors.primary,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  // Confirmed via the Confirm Delivery screen mockup — corrected from
  // Group 6's ungrounded guess (was FontSize.subtitle/8.5).
  buttonLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.body,
    lineHeight: FontSize.body,
  },
  minusLabel: {
    color: Colors.textMuted,
  },
  plusLabel: {
    color: Colors.white,
  },
  value: {
    minWidth: 22,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    fontSize: FontSize.label,
    color: Colors.textSecondary,
  },
});
