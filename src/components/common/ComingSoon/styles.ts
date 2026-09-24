import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subtitle,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: FontSize.subtitle * 1.5,
  },
});
