import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    marginHorizontal: Spacing.lg,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderLeftWidth: 3,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  positionBottom: {
    bottom: Spacing.xxl,
  },
  message: {
    flex: 1,
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.textPrimary,
  },

  // Only the left accent border + icon color carry the variant now —
  // the card itself stays pure white for every variant.
  success: { borderLeftColor: Colors.successGreen },
  error: { borderLeftColor: Colors.errorRed },
  info: { borderLeftColor: Colors.infoText },
});
