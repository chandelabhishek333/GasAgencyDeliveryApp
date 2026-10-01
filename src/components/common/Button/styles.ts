import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontWeight, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },

  // Sizes — vertical padding + label size scale together, per screen spec
  sm: { paddingVertical: 12 },
  md: { paddingVertical: 13 },
  lg: { paddingVertical: 15 },
  labelSm: { fontSize: FontSize.button },
  labelMd: { fontSize: FontSize.buttonLg },
  labelLg: { fontSize: FontSize.buttonLg },

  // Variants
  // Both CTAs in the reference mockup (Login's orange "Send Duty OTP",
  // OTP's blue "Verify & Start Duty") use the same 0.25 shadow opacity —
  // corrected here from Group 4's ungrounded 0.3/0.4 guess.
  primary: {
    backgroundColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  secondary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  outline: {
    backgroundColor: Colors.bgWhite,
    borderWidth: 1,
    borderColor: Colors.borderInput,
  },
  text: {
    backgroundColor: Colors.transparent,
    paddingHorizontal: 0,
  },

  label: {
    textAlign: 'center',
  },
  primaryLabel: {
    color: Colors.white,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  secondaryLabel: {
    color: Colors.white,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  outlineLabel: {
    color: Colors.textSecondary,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  textLabel: {
    color: Colors.primary,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
});
