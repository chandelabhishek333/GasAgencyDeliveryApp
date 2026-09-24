import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: 10,
  },
  customerChip: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.round,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    marginBottom: 4,
  },
  customerChipText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.caption1,
    color: Colors.primary,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.subheading,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subtitle,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: FontSize.subtitle * 1.5,
  },
  otpRow: {
    width: '100%',
    marginVertical: 2,
  },
  resend: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textLight,
  },
  resendHighlight: {
    fontFamily: FontFamily.bold,
    color: Colors.secondary,
  },
  resendLink: {
    fontFamily: FontFamily.bold,
    color: Colors.secondary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
    backgroundColor: Colors.infoBg,
    borderWidth: 1,
    borderColor: Colors.infoBorder,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  infoIcon: {
    fontSize: FontSize.subheading,
  },
  infoText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.footnote,
    color: Colors.infoText,
    lineHeight: FontSize.footnote * 1.4,
  },
  troubleSection: {
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  troubleText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.caption1,
    color: Colors.textLight,
  },
  troubleLink: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.footnote,
    color: Colors.primary,
  },
  footer: {
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.errorRed,
    textAlign: 'center',
  },
});
