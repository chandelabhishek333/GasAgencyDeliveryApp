import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontWeight, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgWhite,
    borderRadius: 14,
    borderWidth: 1,
    // Matches the same card-border tint already used for Home's cards
    // (see Home/styles.ts) — kept raw since it isn't promoted to a
    // theme token there either.
    borderColor: '#EAEFF5',
    paddingVertical: 16,
    paddingHorizontal: Spacing.md,
    marginBottom: 10,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    fontSize: FontSize.subtitle,
    color: Colors.textSecondary,
  },
  body: {
    gap: 3,
  },
  customerName: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.body,
    color: Colors.textDark,
  },
  detailText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
});
