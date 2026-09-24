import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spacing } from '../../theme';

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
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md + 2,
    backgroundColor: Colors.bgWhite,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEFF5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardUnread: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconBoxNewDelivery: { backgroundColor: Colors.secondaryLight },
  iconBoxDeliveryConfirmed: { backgroundColor: Colors.badgeDoneBg },
  iconBoxOrderUpdated: { backgroundColor: Colors.statInProgressBg },
  iconBoxSystem: { backgroundColor: Colors.infoBg },
  iconText: {
    fontSize: FontSize.subheading,
  },
  info: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.labelLg,
    color: Colors.textSecondary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption1,
    color: Colors.textLight,
    marginTop: 2,
  },
  time: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption2,
    color: Colors.textPlaceholder,
    marginTop: 4,
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subtitle,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
});
