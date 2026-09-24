import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.label,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInputField,
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: Spacing.sm,
  },
  fieldFocused: {
    borderWidth: 1.5,
    borderColor: Colors.secondary,
  },
  fieldError: {
    borderWidth: 1.5,
    borderColor: Colors.errorRed,
  },
  fieldDisabled: {
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subtitle,
    color: Colors.textSecondary,
    padding: 0,
  },
  multilineInput: {
    minHeight: 44,
    textAlignVertical: 'top',
  },
  helperText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption1,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.caption1,
    color: Colors.errorRed,
    marginTop: Spacing.xs,
  },
});
