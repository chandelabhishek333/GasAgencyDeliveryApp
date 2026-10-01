import React from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../components/layout/Header';
import { Button } from '../../../components/common/Button';
import { Colors } from '../../../theme';
import { formatRupees } from '../../../utils/formatRupees';
import { PAYMENT_METHOD_LABEL, PAYMENT_SPLIT_LABEL } from '../../../utils/paymentMeta';
import { styles } from './styles';
import { useDeliveryComplete } from './useDeliveryComplete';
import type { ReceiptItem } from '../../../types';
import type { DeliveryCompleteScreenProps } from './types';

interface ReceiptItemsSectionProps {
  title: string;
  total: number;
  items: ReceiptItem[];
}

/**
 * One receipt section (delivered or empties). A single cylinder type is
 * one row — section name with the type beneath it, quantity on the
 * right. Several types get a header with a total badge and one sub-row
 * per type. No breakdown at all (older summaries) falls back to the
 * section total alone.
 */
const ReceiptItemsSection: React.FC<ReceiptItemsSectionProps> = ({ title, total, items }) => {
  if (items.length > 1) {
    return (
      <View style={styles.receiptSection}>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptSectionTitle}>{title}</Text>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>Total: {total}</Text>
          </View>
        </View>
        {items.map((item, index) => (
          <View key={`${item.cylinderType}-${index}`} style={styles.receiptSubRow}>
            <Text style={styles.receiptSubLabel}>{item.label}</Text>
            <Text style={styles.receiptSubValue}>{item.quantity}</Text>
          </View>
        ))}
      </View>
    );
  }

  const [onlyItem] = items;
  return (
    <View style={styles.receiptRow}>
      <View style={styles.receiptLabelGroup}>
        <Text style={styles.receiptLabel}>{title}</Text>
        {onlyItem ? <Text style={styles.receiptItemLabel}>{onlyItem.label}</Text> : null}
      </View>
      <Text style={styles.receiptValue}>{onlyItem?.quantity ?? total}</Text>
    </View>
  );
};

/** Screen 10 — Delivery Success. */
export const DeliveryCompleteScreen: React.FC<DeliveryCompleteScreenProps> = ({ navigation }) => {
  const {
    summary,
    deliveredItems,
    emptyItems,
    emptiesAddedToDue,
    payment,
    isPartial,
    pendingBalance,
    handleViewNextDelivery,
    handleBackToDeliveries,
    handleBack,
  } = useDeliveryComplete(navigation);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgWhite} />
      <Header onBackPress={handleBack} />

      {!summary ? (
        <Text style={styles.errorText}>No completed delivery to show.</Text>
      ) : (
        <>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
            <View style={styles.iconOuter}>
              <View style={styles.iconInner}>
                <Text style={styles.iconText}>✅</Text>
              </View>
            </View>
            <Text style={styles.title}>Delivery Completed!</Text>
            <Text style={styles.subtitle}>
              Order #{summary.orderNumber}
              {'\n'}
              has been successfully delivered.
            </Text>

            <View style={styles.receiptCard}>
              <View style={styles.receiptHeaderRow}>
                <Text style={styles.receiptOrderId}>#{summary.orderNumber}</Text>
                <Text style={styles.receiptTime}>Completed at {summary.completedAt}</Text>
              </View>
              <View style={styles.receiptDivider} />
              <ReceiptItemsSection
                title="Cylinders Delivered"
                total={summary.totalDeliveredQuantity}
                items={deliveredItems}
              />
              <ReceiptItemsSection
                title="Empty Cylinders Collected"
                total={summary.totalEmptyCollectedQuantity}
                items={emptyItems}
              />
              {emptiesAddedToDue > 0 ? (
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Empties Pending (added to customer due)</Text>
                  <Text style={styles.pendingValue}>{emptiesAddedToDue}</Text>
                </View>
              ) : null}

              {payment ? (
                <>
                  <View style={styles.receiptDivider} />
                  <Text style={styles.receiptSectionTitle}>Payment Details</Text>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Payment Mode</Text>
                    <Text style={styles.receiptValueNeutral}>{PAYMENT_METHOD_LABEL[payment.method]}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Payment Status</Text>
                    <View style={[styles.statusBadge, isPartial ? styles.statusBadgePartial : styles.statusBadgeFull]}>
                      <Text
                        style={[
                          styles.statusBadgeText,
                          isPartial ? styles.statusBadgeTextPartial : styles.statusBadgeTextFull,
                        ]}
                      >
                        {PAYMENT_SPLIT_LABEL[payment.split]}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Bill Amount</Text>
                    <Text style={styles.receiptValueNeutral}>{formatRupees(payment.totalBillAmount)}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Amount Collected</Text>
                    <Text style={styles.receiptValueNeutral}>{formatRupees(payment.amountCollected)}</Text>
                  </View>
                  {isPartial || pendingBalance > 0 ? (
                    <View style={styles.receiptRow}>
                      <Text style={styles.receiptLabel}>Pending Balance</Text>
                      <Text style={styles.pendingValue}>{formatRupees(pendingBalance)}</Text>
                    </View>
                  ) : null}
                </>
              ) : null}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button label="View Next Delivery" onPress={handleViewNextDelivery} size="md" />
            <Button
              label="Back to Deliveries"
              onPress={handleBackToDeliveries}
              variant="text"
              size="sm"
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};
