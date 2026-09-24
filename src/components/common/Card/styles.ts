import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, Spacing } from '../../../theme';

export const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  border: {
    borderWidth: 1,
    borderColor: Colors.borderCard,
  },
  shadow: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
