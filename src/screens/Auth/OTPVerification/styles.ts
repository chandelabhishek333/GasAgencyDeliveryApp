import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontWeight, FontSize, Spacing } from '../../../theme';

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
    paddingTop: 10,
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 4,
  },
  glowWrap: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.round,
    backgroundColor: '#FFF3D1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    shadowColor: '#FFC94D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 6,
  },
  keyIcon: {
    fontSize: 30,
    transform: [{ rotate: '-15deg' }],
  },
  title: {
    fontFamily: FontFamily.black,
    fontWeight: FontWeight.black,
    fontSize: FontSize.heading + 1.5,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subtitle + 1.5,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  otpRow: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  resend: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textLight,
    marginBottom: Spacing.lg,
  },
  resendHighlight: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.secondary,
  },
  resendLink: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.secondary,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: 4,
    marginHorizontal: Spacing.xxl,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.infoBg,
    borderRadius: BorderRadius.md,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
  },
  securityText: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.footnote,
    color: Colors.textMuted,
  },
});
