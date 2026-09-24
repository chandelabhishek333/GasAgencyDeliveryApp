import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
  },

  // ---- Blue header ----
  headerSafeArea: {
    backgroundColor: Colors.primary,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md + 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.body,
    color: Colors.white,
  },
  greetingLine: {
    fontFamily: FontFamily.extraBold,
    fontSize: 15,
    color: Colors.white,
  },
  vehicleText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },

  // ---- Content ----
  content: {
    flex: 1,
  },
  contentInner: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  topGroup: {
    gap: Spacing.md,
  },
  bottomGroup: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  errorBanner: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.errorRed,
    textAlign: 'center',
  },

  // ---- Duty Status card ----
  dutyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: '#EAEFF5',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dutyCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 1,
  },
  dutyDot: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.round,
  },
  dutyDotOn: {
    backgroundColor: Colors.successGreen,
    shadowColor: Colors.successGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  dutyDotOff: {
    backgroundColor: Colors.textLight,
  },
  dutyCardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.bodySm,
    color: Colors.textPrimary,
  },
  dutyCardSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.caption1,
    color: Colors.textMuted,
    marginTop: 1,
  },

  // ---- Today's Deliveries card ----
  card: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: '#EAEFF5',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  todayIconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayIconText: {
    fontSize: FontSize.bodyLg,
  },
  todayLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.caption1,
    color: Colors.textMuted,
  },
  todayCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  todayCount: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
    lineHeight: FontSize.heading,
  },
  todayCountUnit: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  dateBadge: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.caption2,
    color: Colors.textLight,
    backgroundColor: Colors.bgLight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    overflow: 'hidden',
  },

  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCell: {
    flex: 1,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  statPending: {
    backgroundColor: Colors.statPendingBg,
    borderColor: Colors.statPendingBorder,
  },
  statInProgress: {
    backgroundColor: Colors.statInProgressBg,
    borderColor: Colors.statInProgressBorder,
  },
  statCompleted: {
    backgroundColor: Colors.statCompletedBg,
    borderColor: Colors.statCompletedBorder,
  },
  statValue: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.bodyLg,
    lineHeight: FontSize.bodyLg,
  },
  statLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.caption2,
    marginTop: 2,
  },
  statPendingText: { color: Colors.secondary },
  statInProgressText: { color: Colors.primary },
  statCompletedText: { color: Colors.successGreen },

  // ---- Vehicle stock cards ----
  vehicleGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  vehicleCell: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  vehicleIconBox: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleIconTruck: {
    backgroundColor: Colors.infoBg,
  },
  vehicleIconBox2: {
    backgroundColor: Colors.warningLight,
  },
  vehicleIconText: {
    fontSize: FontSize.bodySm,
  },
  vehicleLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.caption2,
    color: Colors.textMuted,
  },
  vehicleValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  vehicleValue: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.button,
  },
  vehicleValueBlue: {
    color: Colors.primary,
  },
  vehicleValueAmber: {
    color: Colors.warningYellow,
  },
  vehicleUnit: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption2,
    color: Colors.textMuted,
  },

  // ---- Next Delivery card ----
  nextTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  nextPill: {
    backgroundColor: Colors.statPendingBg,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  nextPillText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.caption2,
    color: Colors.secondary,
  },
  nextSlot: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.caption1,
    color: Colors.textMuted,
  },
  nextBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextInfo: {
    flex: 1,
  },
  nextTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.labelLg,
    color: Colors.textPrimary,
  },
  nextAddress: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption1,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  nextItemsLine: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.caption1,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  nextArrowButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextArrowText: {
    color: Colors.white,
    fontSize: FontSize.bodySm,
  },
  emptyNextText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subtitle,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
  },

  // ---- Shift Performance / Summary card ----
  shiftTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.caption1,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  shiftGrid: {
    flexDirection: 'row',
  },
  shiftCell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  shiftCellDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.divider,
  },
  shiftIcon: {
    fontSize: FontSize.bodyLg,
    marginBottom: 2,
  },
  shiftValue: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.bodySm,
    color: Colors.textPrimary,
  },
  shiftLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.caption2,
    color: Colors.textLight,
  },

  // ---- Safety banner ----
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.safetyBg,
    borderWidth: 1,
    borderColor: Colors.safetyBorder,
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
  },
  safetyIcon: {
    fontSize: FontSize.body,
  },
  safetyText: {
    flex: 1,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.caption2,
    color: Colors.safetyText,
    lineHeight: FontSize.caption2 * 1.3,
  },
  safetyBold: {
    fontFamily: FontFamily.bold,
    color: '#B45309',
  },

  ctaButtonOverride: {
    borderRadius: BorderRadius.md,
  },
});
