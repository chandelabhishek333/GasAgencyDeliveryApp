import React from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { Header } from '../../../components/layout/Header';
import { Badge } from '../../../components/common/Badge';
import { Loader } from '../../../components/common/Loader';
import { OrderItemGroup } from '../../../components/delivery/OrderItemGroup';
import { formatRupees } from '../../../utils/formatRupees';
import { formatDeliveryDate } from '../../../utils/formatShortDate';
import { ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABEL } from '../../../utils/orderStatusMeta';
import { PAYMENT_METHOD_LABEL, PAYMENT_SPLIT_LABEL } from '../../../utils/paymentMeta';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useCompletedOrderDetail } from './useCompletedOrderDetail';
import type { CompletedOrderDetailScreenProps } from './types';

/**
 * Order Details for a finished order (GET /deliveries/{id}/completed-detail):
 * what was delivered/collected, where, and how payment was settled.
 * Read-only — no navigate chip and no footer action.
 */
export const CompletedOrderDetailScreen: React.FC<CompletedOrderDetailScreenProps> = ({ navigation, route }) => {
  const { detail: order, isLoading, error, payment, handleBack, handleCallPress } = useCompletedOrderDetail(
    navigation,
    route,
  );

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
              <Text style={styles.customerName}>{order.customer.name}</Text>
              <Pressable
                onPress={handleCallPress}
                accessibilityRole="button"
                accessibilityLabel="Call customer"
                style={styles.callButton}
              >
                <Text style={styles.callButtonIcon}>📞</Text>
              </Pressable>
            </View>
            <Text style={styles.customerPhone}>{order.customer.phone}</Text>
            <Text style={styles.customerAddress}>📍 {order.customer.address}</Text>
          </View>

          <View>
            <Text style={styles.sectionTitle}>Order Items</Text>
            <View style={styles.itemsList}>
              {order.deliveredItems.length > 0 ? (
                <OrderItemGroup title="Cylinders Delivered" items={order.deliveredItems} />
              ) : null}
              {order.emptyItems.length > 0 ? (
                <OrderItemGroup title="Empty Cylinders Collected" items={order.emptyItems} />
              ) : null}
              {order.deliveryDate ? (
                <View style={styles.dateRow}>
                  <Text style={styles.slotText}>
                    Delivery Date: <Text style={styles.slotTextBold}>{formatDeliveryDate(order.deliveryDate)}</Text>
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {order.driverNotes ? (
            <View>
              <Text style={styles.sectionTitle}>Driver Notes</Text>
              <View style={styles.noteCard}>
                <Text style={styles.noteText}>{order.driverNotes}</Text>
              </View>
            </View>
          ) : null}

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
                    <Text style={styles.amountPaidValue}>{formatRupees(payment.amountPaid)}</Text>
                  </View>
                  {payment.pendingBalance > 0 ? (
                    <View style={styles.settlementRow}>
                      <Text style={styles.settlementLabel}>Balance Pending</Text>
                      <Text style={styles.pendingValue}>{formatRupees(payment.pendingBalance)}</Text>
                    </View>
                  ) : null}
                </>
              ) : (
                <Text style={styles.settlementUnavailable}>No payment was recorded for this order.</Text>
              )}
              {payment ? (
                <>
                  <View style={styles.settlementDivider} />
                  <View style={styles.billRow}>
                    <Text style={styles.billTotalLabel}>Total Order Value</Text>
                    <Text style={styles.totalValue}>{formatRupees(payment.totalAmount)}</Text>
                  </View>
                </>
              ) : null}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
