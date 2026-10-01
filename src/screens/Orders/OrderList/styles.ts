import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontWeight, FontSize, Spacing } from '../../../theme';

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
    fontWeight: FontWeight.extraBold,
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
  // flexGrow: 0 stops the horizontal ScrollView from stretching vertically,
  // and flexShrink: 0 stops it being squeezed: ScrollView defaults to
  // flexShrink: 1, so the long order list below was shrinking this strip a
  // few dp, which capped the tab text's height and cut off its descenders.
  // The negative margin cancels `content`'s side padding so the tabs scroll
  // from screen edge to screen edge instead of being cut at the padding;
  // tabsRow's matching padding keeps "All" aligned with the rest of the screen.
  tabsScroll: {
    flexGrow: 0,
    flexShrink: 0,
    marginHorizontal: -Spacing.lg,
    marginBottom: Spacing.md,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.round,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabInactive: {
    backgroundColor: Colors.bgLight,
  },
  // Explicit lineHeight + no extra font padding so Inter's descenders
  // ("g" in Pending, "y" in Delivery) aren't clipped inside the pill on Android.
  tabTextActive: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.footnote,
    lineHeight: 18,
    includeFontPadding: false,
    color: Colors.white,
  },
  tabTextInactive: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.footnote,
    lineHeight: 18,
    includeFontPadding: false,
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
