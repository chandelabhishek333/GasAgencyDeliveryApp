import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCard,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.sm,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
  },
  tabInactive: {
    backgroundColor: Colors.bgWhite,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
  },
  tabTextActive: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.small,
    color: Colors.white,
  },
  tabTextInactive: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  listContent: {
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.bgWhite,
    borderRadius: 14,
    padding: Spacing.md + 2,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEFF5',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  orderId: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.subtitle,
    color: Colors.textDark,
  },
  customerName: {
    flexShrink: 1,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.body,
    color: Colors.textDark,
  },
  time: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.caption1,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemChip: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    borderRadius: BorderRadius.round,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
  },
  itemChipText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.caption2,
    color: Colors.textMuted,
  },
  errorBanner: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.errorRed,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subtitle,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
});
