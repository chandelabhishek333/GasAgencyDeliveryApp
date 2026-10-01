import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontWeight, FontSize, Spacing } from '../../theme';

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
    fontWeight: FontWeight.black,
    fontSize: FontSize.body,
    color: Colors.white,
  },
  greetingLine: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
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
    gap: 15,
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
    paddingVertical: 16,
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
    fontWeight: FontWeight.bold,
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
    paddingVertical: 17,
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
  todayLabel: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
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
    fontWeight: FontWeight.black,
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
    lineHeight: FontSize.heading,
  },
  todayCountUnit: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  dateBadge: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
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
    paddingVertical: 16,
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
    fontWeight: FontWeight.black,
    fontSize: FontSize.bodyLg,
    lineHeight: FontSize.bodyLg,
  },
  statLabel: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
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
    paddingVertical: 18,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  vehicleLabel: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.caption2,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  vehicleValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 3,
  },
  vehicleValue: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
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
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.caption2,
    color: Colors.secondary,
  },
  nextDate: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.caption1,
    color: Colors.textMuted,
  },
  // Customer name/order id with the arrow button directly opposite it.
  nextHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  nextTitle: {
    flexShrink: 1,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.labelLg,
    color: Colors.textPrimary,
  },
  nextAddress: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption1,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  // Two-column grid, one row per cylinder type: delivered (left) and its
  // empty (right). Fixed flex ratios, both left-aligned, so every
  // "(Collect: …" starts at the same x regardless of text length.
  // flexBasis: 0 is explicit because `flex: n` alone on a Text here grows
  // from its content width, which put each row's column at a different x.
  cylinderRowsContainer: {
    marginTop: Spacing.xs + 2,
    gap: 4,
  },
  cylinderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cylinderDeliveryText: {
    flexGrow: 1.15,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'left',
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.caption1,
    color: Colors.primary,
  },
  cylinderCollectText: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'left',
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.caption2,
    color: Colors.textMuted,
  },
  nextArrowButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextArrowText: {
    color: Colors.white,
    fontSize: 12,
    textAlign: 'center',
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
    fontWeight: FontWeight.bold,
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
  shiftValue: {
    fontFamily: FontFamily.black,
    fontWeight: FontWeight.black,
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.safetyBg,
    borderWidth: 1,
    borderColor: Colors.safetyBorder,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
  },
  safetyText: {
    textAlign: 'center',
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.caption2,
    color: Colors.safetyText,
    lineHeight: FontSize.caption2 * 1.3,
  },
  safetyBold: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: '#B45309',
  },

  ctaButtonOverride: {
    borderRadius: BorderRadius.md,
  },
});
