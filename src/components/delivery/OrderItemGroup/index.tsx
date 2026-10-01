import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import type { OrderItemGroupProps } from './types';

/**
 * A titled list of order lines — one row per cylinder type with its
 * quantity, separated by hairline dividers. Used for the delivered and
 * empty-collection groups on Order Details and Completed Order Details.
 */
export const OrderItemGroup: React.FC<OrderItemGroupProps> = ({ title, items, qtySuffix, testID }) => (
  <View style={styles.group} testID={testID}>
    <Text style={styles.title}>{title}</Text>
    {items.map((item, index) => (
      <View key={`${item.cylinderType}-${index}`} style={[styles.line, index > 0 ? styles.lineDivider : null]}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.qty}>
          Qty: {item.quantity}
          {qtySuffix ? <Text style={styles.qtySuffix}> {qtySuffix}</Text> : null}
        </Text>
      </View>
    ))}
  </View>
);
