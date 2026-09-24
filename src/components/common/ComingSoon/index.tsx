import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import type { ComingSoonProps } from './types';

/**
 * Generic placeholder for a route that exists in the navigation graph
 * but has no designed screen yet (Scan, Support, Payments). Deliberately
 * excluded from components/common's barrel — it's an internal stub,
 * not a reusable design-system primitive.
 */
export const ComingSoon: React.FC<ComingSoonProps> = ({ icon, title, message }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);
