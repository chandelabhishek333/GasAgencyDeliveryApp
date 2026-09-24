import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  // Values below are confirmed via the reference mockup. marginBottom
  // varies 6-8px across screens in the mockup itself (inconsistent
  // demo authoring, not a rule) — 8 (Spacing.sm) matches the majority
  // (Confirm Delivery, Customer OTP, Delivery Success, Delivery
  // History) over the minority 6px (Order Details, Start Delivery).
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  backButton: {
    marginRight: Spacing.sm,
    paddingVertical: 4,
    paddingRight: 4,
  },
  backIcon: {
    fontSize: FontSize.heading,
    fontFamily: FontFamily.semiBold,
    color: Colors.textDark,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.subheading,
    color: Colors.textSecondary,
  },
  rightButton: {
    marginLeft: Spacing.sm,
    paddingVertical: 2,
    paddingLeft: 2,
  },
  rightIcon: {
    fontSize: FontSize.subheading,
    color: Colors.textLight,
  },
  rightLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.subtitle,
    color: Colors.primary,
  },
});
