import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
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
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  receiptIcon: {
    fontSize: FontSize.subheading,
  },
  receiptLabel: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.footnote,
    color: Colors.textMuted,
  },
  receiptValue: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.label,
    color: Colors.successGreen,
  },
  receiptValuePayment: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.label,
    color: Colors.textSecondary,
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
