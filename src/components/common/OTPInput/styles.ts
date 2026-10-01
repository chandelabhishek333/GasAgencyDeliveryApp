import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontWeight, FontSize } from '../../../theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
  },
  box: {
    // No maxWidth — the row must stretch edge-to-edge to match the
    // full-width button below it, not hug a capped intrinsic size.
    flex: 1,
    height: 56,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    textAlign: 'center',
    fontFamily: FontFamily.black,
    fontWeight: FontWeight.black,
    fontSize: FontSize.headingLg + 1.5,
    padding: 0,
  },
  // Empty & unfocused — Customer OTP screen's default box state
  inactive: {
    borderColor: Colors.otpInactiveBorder,
    backgroundColor: Colors.otpInactiveBg,
    color: Colors.textSecondary,
  },
  // Filled or currently focused — Duty OTP screen's box state
  active: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.bgWhite,
    color: Colors.secondary,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  error: {
    borderColor: Colors.errorRed,
    backgroundColor: Colors.bgWhite,
    color: Colors.errorRed,
  },
});
