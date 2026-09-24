import React from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../components/layout/Header';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Loader } from '../../../components/common/Loader';
import { ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABEL } from '../../../utils/orderStatusMeta';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useOrderDetail } from './useOrderDetail';
import type { OrderDetailScreenProps } from './types';

/**
 * Illustrative delivery-instructions and bill data — `Order`
 * (src/types/order.types.ts) has no drop-off-note or payment/bill
 * fields yet. Swap for real data once the backend exposes them.
 */
const PLACEHOLDER_DROPOFF_NOTE = 'Commercial Kitchen Entry — call supervisor on arrival.';
const PLACEHOLDER_BILL = {
  paymentMode: 'Cash on Delivery (COD)',
  totalAmount: '₹14,250',
  lines: [
    { label: 'Cylinder Charges', value: '₹13,500' },
    { label: 'GST (18%)', value: '₹750' },
  ],
};

/**
 * Screen 6 — Order Details. The reference mockup hardcodes a green
 * "Pending Delivery" badge regardless of status — a real detail
 * screen must reflect the order's actual status, so this derives the
 * badge from `order.status` via the shared ORDER_STATUS_* maps
 * instead (a pending order here renders the orange "Pending" pill).
 */
export const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({ navigation, route }) => {
  const {
    order,
    isLoading,
    error,
    handleBack,
    handleCallPress,
    handleNavigatePress,
    handleStartDelivery,
  } = useOrderDetail(navigation, route);

  const cylinderItem = order?.items.find((item) => item.kind === 'cylinderDelivery');
  const emptyItem = order?.items.find((item) => item.kind === 'emptyCollection');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgWhite} />
      <Header
        title="Order Details"
        onBackPress={handleBack}
        rightIcon={<Text style={styles.menuIcon}>⋮</Text>}
      />

      {isLoading ? (
        <Loader label="Loading order..." />
      ) : !order ? (
        <Text style={styles.errorText}>{error ?? 'Order not found.'}</Text>
      ) : (
        <>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.statusRow}>
              <Badge
                label={ORDER_STATUS_LABEL[order.status]}
                variant={ORDER_STATUS_BADGE_VARIANT[order.status]}
              />
              <Text style={styles.orderIdText}>#{order.orderNumber}</Text>
            </View>

            <View style={styles.customerCard}>
              <View style={styles.customerHeaderRow}>
                <Text style={styles.customerName}>{order.customerName}</Text>
                <Pressable
                  onPress={handleCallPress}
                  accessibilityRole="button"
                  style={styles.callButton}
                >
                  <Text style={styles.callButtonIcon}>📞</Text>
                </Pressable>
              </View>
              <Text style={styles.customerPhone}>{order.customerPhone}</Text>
              <Text style={styles.customerAddress}>{order.address}</Text>

              <Pressable
                onPress={handleNavigatePress}
                accessibilityRole="button"
                style={styles.navigateChip}
              >
                <Text style={styles.navigateChipText}>🧭 Navigate to Location</Text>
              </Pressable>
            </View>

            <View>
              <Text style={styles.sectionTitle}>Order Items</Text>
              <View style={styles.itemsList}>
                {cylinderItem ? (
                  <View style={styles.itemRow}>
                    <Text style={styles.itemIcon}>🛢️</Text>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemLabel}>{cylinderItem.label}</Text>
                      <Text style={styles.itemSub}>Qty: {cylinderItem.quantity}</Text>
                    </View>
                  </View>
                ) : null}
                {emptyItem ? (
                  <View style={styles.itemRow}>
                    <Text style={styles.itemIcon}>📦</Text>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemLabel}>{emptyItem.label}</Text>
                      <Text style={styles.itemSub}>Qty: {emptyItem.quantity} (Expected)</Text>
                    </View>
                  </View>
                ) : null}
                <View style={[styles.itemRow, styles.slotRow]}>
                  <Text style={styles.slotIcon}>🕒</Text>
                  <Text style={styles.slotText}>
                    Delivery Time Slot:{' '}
                    <Text style={styles.slotTextBold}>
                      {order.timeSlotStart} - {order.timeSlotEnd}
                    </Text>
                  </Text>
                </View>
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
              <Text style={styles.sectionTitle}>Bill & Payment Details</Text>
              <View style={styles.billCard}>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Payment Mode</Text>
                  <Text style={styles.billValue}>{PLACEHOLDER_BILL.paymentMode}</Text>
                </View>
                <View style={styles.billDivider} />
                {PLACEHOLDER_BILL.lines.map((line) => (
                  <View key={line.label} style={styles.billRow}>
                    <Text style={styles.billLineLabel}>{line.label}</Text>
                    <Text style={styles.billLineValue}>{line.value}</Text>
                  </View>
                ))}
                <View style={styles.billDivider} />
                <View style={styles.billRow}>
                  <Text style={styles.billTotalLabel}>Total Amount</Text>
                  <Text style={styles.billTotalValue}>{PLACEHOLDER_BILL.totalAmount}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button label="Start Delivery" onPress={handleStartDelivery} size="lg" />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};
