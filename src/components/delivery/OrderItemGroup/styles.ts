import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontWeight, FontSize } from '../../../theme';

export const styles = StyleSheet.create({
  group: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.md,
    paddingVertical: 9,
    paddingHorizontal: 11,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  lineDivider: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  label: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  qty: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.small,
    color: Colors.secondary,
  },
  qtySuffix: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    fontSize: FontSize.caption1,
    color: Colors.textLight,
  },
});
