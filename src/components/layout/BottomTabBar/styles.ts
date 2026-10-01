import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, FontWeight, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.navBarBg,
    borderTopWidth: 1,
    borderTopColor: Colors.navBarBorder,
    paddingTop: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconWrap: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.errorRed,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.navBarBg,
  },
  badgeText: {
    color: Colors.bgWhite,
    fontSize: 10,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    includeFontPadding: false,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.caption1,
  },
  inactive: {
    color: Colors.navItemInactive,
  },
  active: {
    color: Colors.navItemActive,
  },
});
