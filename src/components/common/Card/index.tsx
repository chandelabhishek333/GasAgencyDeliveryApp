import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import type { CardProps } from './types';

/** White, bordered, softly-shadowed container used across nearly every screen. */
export const Card: React.FC<CardProps> = ({
  children,
  padding,
  noBorder = false,
  noShadow = false,
  style,
  testID,
}) => (
  <View
    testID={testID}
    style={[
      styles.base,
      !noBorder && styles.border,
      !noShadow && styles.shadow,
      padding !== undefined && { padding },
      style,
    ]}
  >
    {children}
  </View>
);
