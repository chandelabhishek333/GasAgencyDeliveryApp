import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Badge } from '../../common/Badge';
import { formatDeliveryDate } from '../../../utils/formatShortDate';
import { ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABEL } from '../../../utils/orderStatusMeta';
import { styles } from './styles';
import type { OrderCardProps } from './types';

/** Order-list card: order id + status pill, customer name, address and delivery date. */
export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress, testID }) => (
  <Pressable
    onPress={onPress ? () => onPress(order) : undefined}
    disabled={!onPress}
    style={styles.container}
    testID={testID}
  >
    <View style={styles.headerRow}>
      <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
      <Badge
        label={ORDER_STATUS_LABEL[order.status]}
        variant={ORDER_STATUS_BADGE_VARIANT[order.status]}
        showChevron
      />
    </View>

    <View style={styles.body}>
      <Text style={styles.customerName} numberOfLines={1}>
        {order.customerName}
      </Text>
      <Text style={styles.detailText} numberOfLines={1}>
        📍 {order.address}
      </Text>
      {order.deliveryDate ? (
        <Text style={styles.detailText}>{formatDeliveryDate(order.deliveryDate)}</Text>
      ) : null}
    </View>
  </Pressable>
);
