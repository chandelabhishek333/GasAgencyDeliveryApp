import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Colors } from '../../../theme';
import { styles } from './styles';
import type { LoaderProps } from './types';

/** Centered brand-blue spinner, optionally as a full-screen overlay. */
export const Loader: React.FC<LoaderProps> = ({ size = 'large', label, fullScreen = false, testID }) => (
  <View style={[styles.container, fullScreen && styles.fullScreen]} testID={testID}>
    <ActivityIndicator size={size} color={Colors.primary} />
    {label ? <Text style={styles.label}>{label}</Text> : null}
  </View>
);
