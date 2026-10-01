import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontWeight, FontSize, Spacing } from '../../../theme';

const cardShadow = {
  shadowColor: Colors.black,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },

  // ---- Section A: Profile header ----
  avatarSection: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  avatarWrap: {
    width: 84,
    height: 84,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.headingLg,
    color: Colors.primary,
  },
  avatarEditBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.secondary,
    borderWidth: 2,
    borderColor: Colors.bgWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditIcon: {
    fontSize: FontSize.caption1,
  },
  name: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.subheading,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 2,
  },
  verifiedBadge: {
    backgroundColor: Colors.badgeDoneBg,
    borderRadius: BorderRadius.round,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
  },
  verifiedBadgeText: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.caption2,
    color: Colors.badgeDoneText,
  },
  idBadge: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    borderRadius: BorderRadius.round,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
  },
  idBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.caption2,
    color: Colors.textMuted,
  },

  // ---- Section B: Stats grid ----
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 2,
  },
  statCardBlue: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryBorder,
  },
  statCardGreen: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.successBorder,
  },
  statCardOrange: {
    backgroundColor: Colors.secondaryLight,
    borderColor: Colors.secondaryLightBorder,
  },
  statIcon: {
    fontSize: FontSize.body,
  },
  statValue: {
    fontFamily: FontFamily.black,
    fontWeight: FontWeight.black,
    fontSize: FontSize.bodySm,
  },
  statValueBlue: {
    color: Colors.primary,
  },
  statValueGreen: {
    color: Colors.successGreen,
  },
  statValueOrange: {
    color: Colors.secondary,
  },
  statLabel: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.caption2,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  // ---- Section C: Vehicle & hub info card ----
  infoCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    ...cardShadow,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  infoIconBox: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconBlue: {
    backgroundColor: Colors.primaryLight,
  },
  infoIconOrange: {
    backgroundColor: Colors.secondaryLight,
  },
  infoIconText: {
    fontSize: FontSize.subheading,
  },
  infoTextCol: {
    gap: 1,
  },
  infoText: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.subtitle,
    color: Colors.textDark,
  },
  infoSubText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.caption1,
    color: Colors.textMuted,
  },

  // ---- Section D: Menu groups ----
  menuGroup: {
    gap: Spacing.sm,
  },
  menuGroupTitle: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.caption1,
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 2,
  },
  menuCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    ...cardShadow,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  menuRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 1,
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconBlue: {
    backgroundColor: Colors.primaryLight,
  },
  menuIconText: {
    fontSize: FontSize.body,
  },
  menuLabel: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.subtitle,
    color: Colors.textDark,
    flexShrink: 1,
  },
  menuChevron: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.button,
    color: Colors.textPlaceholder,
  },

  // ---- Section E: Logout ----
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.errorLight,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    paddingVertical: Spacing.md,
    marginTop: Spacing.xs,
  },
  logoutAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.errorRed,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  logoutAllButtonBusy: {
    opacity: 0.6,
  },
  logoutIcon: {
    fontSize: FontSize.body,
  },
  logoutLabel: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.label,
    color: Colors.errorRed,
  },
});
