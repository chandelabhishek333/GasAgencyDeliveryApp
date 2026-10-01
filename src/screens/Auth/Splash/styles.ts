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
  },
  logo: {
    width: 106,
    height: 106,
    marginBottom: Spacing.md,
  },
  wordmark: {
    fontFamily: FontFamily.black,
    fontWeight: FontWeight.black,
    fontSize: FontSize.display + 1.5,
    color: Colors.primary,
    letterSpacing: LetterSpacing.wide,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subLabel: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.label + 1.5,
    color: Colors.textMuted,
    letterSpacing: LetterSpacing.wider,
    textTransform: 'uppercase',
    marginBottom: Spacing.xxl,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: FontFamily.black,
    fontWeight: FontWeight.black,
    fontSize: FontSize.heading + 1.5,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: (FontSize.heading + 1.5) * LineHeight.relaxed,
    marginBottom: Spacing.xxl,
  },
  badge: {
    width: 108,
    height: 108,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  badgeIcon: {
    fontSize: 48,
  },
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  // Size + color are animated per dot in index.tsx (the sequential wave).
  dot: {
    borderRadius: BorderRadius.round,
  },
  version: {
    textAlign: 'center',
    fontFamily: FontFamily.medium,
    fontSize: FontSize.footnote,
    color: Colors.textPlaceholder,
  },
});
