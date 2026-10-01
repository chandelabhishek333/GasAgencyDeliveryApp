import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontWeight, FontSize, LetterSpacing, LineHeight, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.md,
  },
  logo: {
    width: 78,
    height: 78,
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: FontFamily.black,
    fontWeight: FontWeight.black,
    fontSize: FontSize.headingLg + 1.5,
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  // Not an existing theme token — a one-off pill background distinct
  // from primaryLight, confirmed via the reference mockup.
  dutyBadge: {
    backgroundColor: '#E1EEF8',
    borderRadius: BorderRadius.round,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: Spacing.md,
  },
  dutyBadgeText: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.labelLg + 1.5,
    color: Colors.primary,
    letterSpacing: LetterSpacing.normal,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subtitle + 1.5,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: (FontSize.subtitle + 1.5) * LineHeight.tight,
    marginBottom: Spacing.xxl,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '100%',
    backgroundColor: Colors.bgWhite,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  flag: {
    fontSize: 20,
  },
  codeWrap: {
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
    paddingRight: 6,
  },
  code: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.subtitle,
    color: Colors.textLight,
  },
  phoneInput: {
    flex: 1,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.buttonLg,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.tight,
    padding: 0,
  },
  footer: {
    textAlign: 'center',
    fontFamily: FontFamily.medium,
    fontSize: FontSize.footnote,
    color: Colors.textLight,
    paddingBottom: Spacing.sm,
  },
});
