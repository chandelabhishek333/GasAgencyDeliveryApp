import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spacing } from '../../../theme';

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
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.secondary,
    borderWidth: 1.5,
    borderColor: Colors.navBarBg,
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
