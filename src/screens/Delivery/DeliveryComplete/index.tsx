import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../components/layout/Header';
import { Button } from '../../../components/common/Button';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useDeliveryComplete } from './useDeliveryComplete';
import type { DeliveryCompleteScreenProps } from './types';

/**
 * Illustrative payment-collected figure — `DeliverySummary`
 * (src/types/delivery.types.ts) has no payment/amount field yet.
 * Swap for real data once the backend exposes it.
 */
const PLACEHOLDER_PAYMENT_COLLECTED = '₹14,250 (Cash)';

/** Screen 10 — Delivery Success. */
export const DeliveryCompleteScreen: React.FC<DeliveryCompleteScreenProps> = ({ navigation }) => {
  const { summary, handleViewNextDelivery, handleBackToDeliveries, handleBack } =
    useDeliveryComplete(navigation);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgWhite} />
      <Header onBackPress={handleBack} />

      {!summary ? (
        <Text style={styles.errorText}>No completed delivery to show.</Text>
      ) : (
        <>
          <View style={styles.content}>
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
              <View style={styles.receiptRow}>
                <Text style={styles.receiptIcon}>🛢️</Text>
                <Text style={styles.receiptLabel}>Cylinders Delivered</Text>
                <Text style={styles.receiptValue}>{summary.deliveredQuantity}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptIcon}>📦</Text>
                <Text style={styles.receiptLabel}>Empties Collected</Text>
                <Text style={styles.receiptValue}>{summary.emptyCollectedQuantity}</Text>
              </View>
              <View style={styles.receiptDivider} />
              <View style={styles.receiptRow}>
                <Text style={styles.receiptIcon}>💵</Text>
                <Text style={styles.receiptLabel}>Payment Collected</Text>
                <Text style={styles.receiptValuePayment}>{PLACEHOLDER_PAYMENT_COLLECTED}</Text>
              </View>
            </View>
          </View>

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
