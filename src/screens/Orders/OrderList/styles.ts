import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCard,
  },
  content: {
    flex: 1,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.subheading,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgWhite,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchIcon: {
    fontSize: FontSize.small,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    padding: 0,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabInactive: {
    backgroundColor: Colors.bgLight,
  },
  tabTextActive: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.footnote,
    color: Colors.white,
  },
  tabTextInactive: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.footnote,
    color: Colors.textMuted,
  },
  listContent: {
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
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
