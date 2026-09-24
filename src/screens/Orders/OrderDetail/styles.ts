import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  menuIcon: {
    fontSize: FontSize.subheading,
    color: Colors.textLight,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.small,
    color: Colors.textLight,
  },
  customerCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EAEFF5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  customerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.bodySm,
    color: Colors.textSecondary,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonIcon: {
    fontSize: FontSize.subheading,
  },
  customerPhone: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.footnote,
    color: Colors.secondary,
    marginBottom: 4,
  },
  customerAddress: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.footnote,
    color: Colors.textMuted,
    lineHeight: FontSize.footnote * 1.4,
  },
  navigateChip: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.round,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
  },
  navigateChipText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.caption1,
    color: Colors.primary,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.label,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  itemsList: {
    gap: 6,
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
    fontSize: 18,
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
  slotRow: {
    paddingVertical: 6,
  },
  slotIcon: {
    fontSize: FontSize.subheading,
  },
  slotText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.footnote,
    color: Colors.textMuted,
  },
  slotTextBold: {
    fontFamily: FontFamily.bold,
  },
  noteCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EAEFF5',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  noteAddress: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  noteText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.footnote,
    color: Colors.textMuted,
    lineHeight: FontSize.footnote * 1.4,
  },
  billCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EAEFF5',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.footnote,
    color: Colors.textMuted,
  },
  billValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.footnote,
    color: Colors.textSecondary,
  },
  billLineLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption1,
    color: Colors.textLight,
  },
  billLineValue: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.caption1,
    color: Colors.textMuted,
  },
  billDivider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  billTotalLabel: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.label,
    color: Colors.textSecondary,
  },
  billTotalValue: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.subheading,
    color: Colors.successGreen,
  },
  footer: {
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subtitle,
    color: Colors.errorRed,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
