import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCard,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    paddingVertical: 18,
    paddingHorizontal: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.md,
    paddingVertical: 7,
    paddingHorizontal: 9,
  },
  itemIcon: {
    fontSize: 22,
  },
  itemInfo: {
    flex: 1,
  },
  itemLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  itemSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption1,
    color: Colors.textLight,
  },
  summaryCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    gap: Spacing.xs,
  },
  summaryTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.label,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.footnote,
    color: Colors.textMuted,
  },
  summaryValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.footnote,
    color: Colors.textSecondary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 2,
  },
  summaryTotalLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  summaryTotalValue: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.subtitle,
  },
  summaryTotalNeutral: {
    color: Colors.successGreen,
  },
  summaryTotalWarn: {
    color: Colors.warningYellow,
  },
  notesLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.label,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  notesInput: {
    backgroundColor: Colors.bgWhite,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minHeight: 80,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.footnote,
    color: Colors.textSecondary,
    textAlignVertical: 'top',
  },
  footer: {
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  errorBanner: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.errorRed,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subtitle,
    color: Colors.errorRed,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
