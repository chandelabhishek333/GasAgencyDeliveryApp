import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontWeight, FontSize } from '../../../theme';
import { styles as orderDetailStyles } from '../OrderDetail/styles';

/**
 * Builds on Order Details' styles so the two detail screens stay visually
 * identical; only the settlement card below is specific to this screen.
 */
export const styles = StyleSheet.create({
  ...orderDetailStyles,
  settlementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settlementLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.footnote,
    color: Colors.textMuted,
  },
  settlementValue: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.footnote,
    color: Colors.textSecondary,
  },
  settlementDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 2,
  },
  amountPaidValue: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.bodyLg,
    color: Colors.successGreen,
  },
  pendingValue: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.body,
    color: Colors.warningYellow,
  },
  totalValue: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  settlementUnavailable: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.footnote,
    color: Colors.textLight,
  },
});
