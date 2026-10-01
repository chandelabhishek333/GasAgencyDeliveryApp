import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontWeight, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  scroll: {
    flex: 1,
  },
  // flexGrow (not flex) so a short receipt stays vertically centered
  // while a long multi-type one scrolls instead of being squeezed.
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: 10,
  },
  // Outer ring approximates the mockup's "0 0 0 8px" glow spread,
  // which RN's shadow props can't express directly.
  iconOuter: {
    width: 112,
    height: 112,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(22,163,74,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.badgeDoneBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.headingLg,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subtitle,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: FontSize.subtitle * 1.5,
  },
  receiptCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: 14,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    width: '100%',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#EAEFF5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  receiptHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptOrderId: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.subtitle,
    color: Colors.textDark,
  },
  receiptTime: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.caption1,
    color: Colors.textMuted,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  // space-between rather than `flex: 1` on the label: receiptLabel is
  // also used inside the column-direction receiptLabelGroup, where a
  // flex:1 Text in an auto-height parent can collapse to 0 under Fabric.
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  receiptLabelGroup: {
    flexShrink: 1,
    gap: 2,
  },
  receiptLabel: {
    flexShrink: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.footnote,
    color: Colors.textMuted,
  },
  /** Cylinder type under a single-type section's label, e.g. "19 KG Commercial". */
  receiptItemLabel: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.label,
    color: Colors.textDark,
  },
  receiptValue: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.label,
    color: Colors.successGreen,
  },
  receiptValueNeutral: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.label,
    color: Colors.textSecondary,
  },
  receiptSection: {
    gap: Spacing.xs,
  },
  receiptSectionTitle: {
    flexShrink: 1,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.footnote,
    color: Colors.textDark,
  },
  // Per-type lines under a multi-type section, indented off the header.
  receiptSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingLeft: Spacing.md,
  },
  receiptSubLabel: {
    flexShrink: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.footnote,
    color: Colors.textMuted,
  },
  receiptSubValue: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.label,
    color: Colors.textDark,
  },
  totalBadge: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.badgeDoneBg,
  },
  totalBadgeText: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.caption1,
    color: Colors.badgeDoneText,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.round,
  },
  statusBadgeFull: {
    backgroundColor: Colors.successLight,
  },
  statusBadgePartial: {
    backgroundColor: Colors.warningLight,
  },
  statusBadgeText: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.caption1,
  },
  statusBadgeTextFull: {
    color: Colors.successGreen,
  },
  statusBadgeTextPartial: {
    color: Colors.warningYellow,
  },
  pendingValue: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.label,
    color: Colors.secondary,
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
