import React from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { Header } from '../../../components/layout/Header';
import { Badge } from '../../../components/common/Badge';
import { Loader } from '../../../components/common/Loader';
import { OrderItemGroup } from '../../../components/delivery/OrderItemGroup';
import { PLACEHOLDER_DROPOFF_NOTE } from '../../../constants/placeholders';
import { formatRupees } from '../../../utils/formatRupees';
import { formatDeliveryDate } from '../../../utils/formatShortDate';
import { ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABEL } from '../../../utils/orderStatusMeta';
import { PAYMENT_METHOD_LABEL, PAYMENT_SPLIT_LABEL } from '../../../utils/paymentMeta';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useCompletedOrderDetail } from './useCompletedOrderDetail';
import type { CompletedOrderDetailScreenProps } from './types';

/**
 * Order Details for a delivered order: what was delivered/collected, where,
 * and how payment was settled. Read-only — no navigate chip and no footer
 * action, since the delivery is finished.
 */
export const CompletedOrderDetailScreen: React.FC<CompletedOrderDetailScreenProps> = ({ navigation, route }) => {
  const { order, isLoading, error, payment, totalAmount, pendingBalance, handleBack, handleCallPress } =
    useCompletedOrderDetail(navigation, route);

  const cylinderItems = order?.items.filter((item) => item.kind === 'cylinderDelivery') ?? [];
  const emptyItems = order?.items.filter((item) => item.kind === 'emptyCollection') ?? [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgWhite} />
      <Header title="Order Details" onBackPress={handleBack} />

      {isLoading ? (
        <Loader label="Loading order..." />
      ) : !order ? (
        <Text style={styles.errorText}>{error ?? 'Order not found.'}</Text>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
          <View style={styles.statusRow}>
            <Badge label={ORDER_STATUS_LABEL[order.status]} variant={ORDER_STATUS_BADGE_VARIANT[order.status]} />
            <Text style={styles.orderIdText}>#{order.orderNumber}</Text>
          </View>

          <View style={styles.customerCard}>
            <View style={styles.customerHeaderRow}>
              <Text style={styles.customerName}>{order.customerName}</Text>
              <Pressable
                onPress={handleCallPress}
                accessibilityRole="button"
                accessibilityLabel="Call customer"
                style={styles.callButton}
              >
                <Text style={styles.callButtonIcon}>📞</Text>
              </Pressable>
            </View>
            <Text style={styles.customerPhone}>{order.customerPhone}</Text>
            <Text style={styles.customerAddress}>📍 {order.address}</Text>
          </View>

          <View>
            <Text style={styles.sectionTitle}>Order Items</Text>
            <View style={styles.itemsList}>
              {cylinderItems.length > 0 ? <OrderItemGroup title="Cylinders Delivered" items={cylinderItems} /> : null}
              {emptyItems.length > 0 ? <OrderItemGroup title="Empty Cylinders Collected" items={emptyItems} /> : null}
              {order.deliveryDate ? (
                <View style={styles.dateRow}>
                  <Text style={styles.slotText}>
                    Delivery Date: <Text style={styles.slotTextBold}>{formatDeliveryDate(order.deliveryDate)}</Text>
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View>
            <Text style={styles.sectionTitle}>Delivery Location & Instructions</Text>
            <View style={styles.noteCard}>
              <Text style={styles.noteAddress}>📍 {order.address}</Text>
              <Text style={styles.noteText}>{PLACEHOLDER_DROPOFF_NOTE}</Text>
            </View>
          </View>

          <View>
            <Text style={styles.sectionTitle}>Payment & Settlement Details</Text>
            <View style={styles.billCard}>
              {payment ? (
                <>
                  <View style={styles.settlementRow}>
                    <Text style={styles.settlementLabel}>Payment Mode</Text>
                    <Text style={styles.settlementValue}>{PAYMENT_METHOD_LABEL[payment.method]}</Text>
                  </View>
                  <View style={styles.settlementRow}>
                    <Text style={styles.settlementLabel}>Payment Type</Text>
                    <Text style={styles.settlementValue}>{PAYMENT_SPLIT_LABEL[payment.split]}</Text>
                  </View>
                  <View style={styles.settlementDivider} />
                  <View style={styles.settlementRow}>
                    <Text style={styles.settlementLabel}>Amount Paid</Text>
                    <Text style={styles.amountPaidValue}>{formatRupees(payment.amount)}</Text>
                  </View>
                  {pendingBalance > 0 ? (
                    <View style={styles.settlementRow}>
                      <Text style={styles.settlementLabel}>Balance Pending</Text>
                      <Text style={styles.pendingValue}>{formatRupees(pendingBalance)}</Text>
                    </View>
                  ) : null}
                </>
              ) : (
                <Text style={styles.settlementUnavailable}>Payment details aren't available for this order yet.</Text>
              )}
              <View style={styles.settlementDivider} />
              <View style={styles.billRow}>
                <Text style={styles.billTotalLabel}>Total Order Value</Text>
                <Text style={styles.totalValue}>{formatRupees(totalAmount)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
