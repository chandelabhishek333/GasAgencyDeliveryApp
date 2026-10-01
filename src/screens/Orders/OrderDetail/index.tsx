import React from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { Header } from '../../../components/layout/Header';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Loader } from '../../../components/common/Loader';
import { OrderItemGroup } from '../../../components/delivery/OrderItemGroup';
import { PLACEHOLDER_DROPOFF_NOTE } from '../../../constants/placeholders';
import { formatRupees } from '../../../utils/formatRupees';
import { formatDeliveryDate } from '../../../utils/formatShortDate';
import { getPayableAmount } from '../../../utils/getPayableAmount';
import { ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABEL } from '../../../utils/orderStatusMeta';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useOrderDetail } from './useOrderDetail';
import type { OrderDetailScreenProps } from './types';

/**
 * Screen 6 — Order Details. The reference mockup hardcodes a green
 * "Pending Delivery" badge regardless of status — a real detail
 * screen must reflect the order's actual status, so this derives the
 * badge from `order.status` via the shared ORDER_STATUS_* maps
 * instead (a pending order here renders the orange "Pending" pill).
 *
 * Root is a plain View, not a bottom-edge SafeAreaView: this screen sits
 * inside MainTabNavigator, whose BottomTabBar already pads for the
 * system nav bar — a second bottom inset here left a ~50dp gap between
 * the footer button and the tabs.
 */
export const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({ navigation, route }) => {
  const {
    order,
    isLoading,
    error,
    handleBack,
    handleCallPress,
    handleNavigatePress,
    handleOutForDelivery,
  } = useOrderDetail(navigation, route);

  const cylinderItems = order?.items.filter((item) => item.kind === 'cylinderDelivery') ?? [];
  const emptyItems = order?.items.filter((item) => item.kind === 'emptyCollection') ?? [];

  return (
    <View style={styles.container}>
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
                <Text style={styles.navigateChipText}>Navigate to Location</Text>
              </Pressable>
            </View>

            <View>
              <Text style={styles.sectionTitle}>Order Items</Text>
              <View style={styles.itemsList}>
                {cylinderItems.length > 0 ? (
                  <OrderItemGroup title="Cylinders to Deliver" items={cylinderItems} />
                ) : null}
                {emptyItems.length > 0 ? (
                  <OrderItemGroup
                    title="Empty Cylinders to Collect"
                    items={emptyItems}
                    qtySuffix="(Expected)"
                  />
                ) : null}
                {order.deliveryDate ? (
                  <View style={styles.dateRow}>
                    <Text style={styles.slotText}>
                      Delivery Date:{' '}
                      <Text style={styles.slotTextBold}>{formatDeliveryDate(order.deliveryDate)}</Text>
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
              <Text style={styles.sectionTitle}>Bill & Payment Details</Text>
              <View style={styles.billCard}>
                <View style={styles.billRow}>
                  <Text style={styles.billTotalLabel}>Payable Amount</Text>
                  <Text style={styles.billTotalValue}>{formatRupees(getPayableAmount(order))}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button label="Out for Delivery" onPress={handleOutForDelivery} size="lg" />
          </View>
        </>
      )}
    </View>
  );
};
