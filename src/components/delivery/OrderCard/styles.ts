import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgWhite,
    borderRadius: 14,
    borderWidth: 1,
    // Matches the same card-border tint already used for Home's cards
    // (see Home/styles.ts) — kept raw since it isn't promoted to a
    // theme token there either.
    borderColor: '#EAEFF5',
    paddingVertical: Spacing.md,
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
    fontSize: FontSize.subtitle,
    color: Colors.textSecondary,
  },
  bodyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: FontSize.subheading,
  },
  bodyInfo: {
    flex: 1,
    gap: 2,
    justifyContent: 'center',
  },
  customerName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.body,
    color: Colors.textDark,
  },
  detailText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
});
