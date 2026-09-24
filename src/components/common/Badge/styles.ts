import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.round,
    gap: 2,
  },
  // Corrected from Group 4's guess — the reference mockup's status
  // pills (Order List's "Pending ›"/"In Progress ›") use 2x6 padding.
  md: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm + 2,
  },
  sm: {
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
  },
  labelMd: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.caption1,
  },
  labelSm: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.caption2,
  },
  chevron: {
    fontFamily: FontFamily.bold,
  },

  // Variants — light tint background + matching text (pending/inProgress/completed/info)
  pending: { backgroundColor: Colors.badgePendingBg },
  pendingLabel: { color: Colors.badgePendingText },
  inProgress: { backgroundColor: Colors.badgeInProgressBg },
  inProgressLabel: { color: Colors.badgeInProgressText },
  completed: { backgroundColor: Colors.badgeDoneBg },
  completedLabel: { color: Colors.badgeDoneText },
  info: { backgroundColor: Colors.infoBg, borderWidth: 1, borderColor: Colors.infoBorder },
  infoLabel: { color: Colors.infoText },

  // "delivered" is the solid badge used in history lists.
  delivered: { backgroundColor: Colors.badgeDoneSmBg },
  deliveredLabel: { color: Colors.white },
});
