import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  step: {
    alignItems: 'center',
    width: 64,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.borderLight,
  },
  dotDone: {
    backgroundColor: Colors.successGreen,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  connector: {
    flex: 1,
    height: 2,
    marginTop: 5,
    backgroundColor: Colors.borderLight,
  },
  connectorDone: {
    backgroundColor: Colors.successGreen,
  },
  label: {
    marginTop: Spacing.xs,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.caption1,
    color: Colors.textLight,
    textAlign: 'center',
  },
  labelActive: {
    fontFamily: FontFamily.semiBold,
    color: Colors.textSecondary,
  },
});
