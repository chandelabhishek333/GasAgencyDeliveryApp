import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontWeight, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.subheading,
    color: Colors.textDark,
    textAlign: 'center',
  },

  // ---- Map placeholder ----
  // Not a real react-native-maps integration (out of scope for this
  // group) — a static illustration matching the mockup's "fake map"
  // look, minus its fine repeating grid texture (would need SVG).
  mapArea: {
    height: '42%',
    borderRadius: 16,
    backgroundColor: '#E8F4FD',
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    overflow: 'hidden',
    position: 'relative',
  },
  roadLineDiagonal: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: Colors.overlayWhite,
    transform: [{ translateY: -4 }, { rotate: '-15deg' }],
  },
  roadLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '40%',
    width: 8,
    backgroundColor: Colors.overlayWhite,
  },
  pinWrap: {
    position: 'absolute',
    top: '42%',
    left: '50%',
    marginLeft: -16,
    marginTop: -16,
  },
  pin: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  pinIcon: {
    fontSize: FontSize.subheading,
  },
  mapLabelChip: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.sm,
    paddingVertical: 3,
    paddingHorizontal: 6,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapLabelText: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.caption2,
    color: Colors.textDark,
  },

  successText: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.small,
    color: Colors.successGreen,
    textAlign: 'center',
  },

  addressCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EAEFF5',
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  addressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  addressInfo: {
    flex: 1,
  },
  locationIcon: {
    fontSize: FontSize.heading,
  },
  locationName: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  locationAddress: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption1,
    color: Colors.textLight,
  },
  addressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  etaChip: {
    backgroundColor: Colors.successLight,
    borderRadius: BorderRadius.round,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
  },
  etaChipText: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.caption2,
    color: Colors.successGreen,
  },
  mapsLink: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.caption1,
    color: Colors.primary,
  },

  footer: {
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subtitle,
    color: Colors.errorRed,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
