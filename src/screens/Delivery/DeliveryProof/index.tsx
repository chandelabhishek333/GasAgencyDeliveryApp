import React from 'react';
import { Pressable, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import { Header } from '../../../components/layout/Header';
import { Button } from '../../../components/common/Button';
import { PaymentCollectionCard } from '../../../components/delivery/PaymentCollectionCard';
import { QuantityStepper } from '../../../components/delivery/QuantityStepper';
import { UpdateOrderSheet } from '../../../components/delivery/UpdateOrderSheet';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useDeliveryProof } from './useDeliveryProof';
import type { OrderItem } from '../../../types';
import type { DeliveryProofScreenProps } from './types';

interface QuantityCardProps {
  title: string;
  items: OrderItem[];
  countLabel: string;
  quantities: Record<string, number>;
  /** Omit for a read-only card: each row shows a static "Qty: N" instead of a stepper. */
  onChange?: (itemId: string, quantity: number) => void;
}

/**
 * One quantity card — a row per cylinder type. Delivered quantities are
 * read-only here (changed only via "Update Order"); empties keep a
 * stepper so the driver can record what was actually collected.
 */
const QuantityCard: React.FC<QuantityCardProps> = ({ title, items, countLabel, quantities, onChange }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={styles.itemList}>
      {items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemSub}>
              {countLabel}: {item.quantity}
            </Text>
          </View>
          {onChange ? (
            <QuantityStepper
              value={quantities[item.id] ?? 0}
              onChange={(quantity) => onChange(item.id, quantity)}
              min={0}
            />
          ) : (
            <Text style={styles.staticQty}>Qty: {quantities[item.id] ?? item.quantity}</Text>
          )}
        </View>
      ))}
    </View>
  </View>
);

/**
 * Screen 8 — Confirm Delivery: per-cylinder-type delivered/collected
 * quantities (with "Update Order" to add new cylinder types), payment
 * collection (Cash / QR, full / partial), and notes.
 *
 * Root is a plain View, not a bottom-edge SafeAreaView: this screen sits
 * inside MainTabNavigator, whose BottomTabBar already pads for the
 * system nav bar, so a second bottom inset would float the footer
 * button well above the tabs.
 */
export const DeliveryProofScreen: React.FC<DeliveryProofScreenProps> = ({ navigation }) => {
  const {
    activeDelivery,
    draft,
    cylinderItems,
    emptyItems,
    quantities,
    totalDelivered,
    totalCollected,
    netDifference,
    payableAmount,
    partialAmount,
    partialAmountError,
    isLoading,
    error,
    setItemQuantity,
    setNotes,
    setPaymentMethod,
    setPaymentSplit,
    setPartialAmountInput,
    qrAmount,
    isUpdateSheetOpen,
    openUpdateSheet,
    closeUpdateSheet,
    handleConfirmUpdate,
    handleProceed,
    handleBack,
  } = useDeliveryProof(navigation);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgCard} />
      <Header title="Confirm Delivery" onBackPress={handleBack} />

      {!activeDelivery || !draft ? (
        <Text style={styles.errorText}>{error ?? 'No active delivery selected.'}</Text>
      ) : (
        <>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.orderRow}>
              <Text style={styles.orderNumber}>#{activeDelivery.orderNumber}</Text>
              <Pressable onPress={openUpdateSheet} style={styles.updateButton} accessibilityRole="button">
                <Text style={styles.updateButtonText}>+ Update Order</Text>
              </Pressable>
            </View>

            {cylinderItems.length > 0 ? (
              <QuantityCard
                title="Delivered Quantity"
                items={cylinderItems}
                countLabel="Ordered"
                quantities={quantities}
              />
            ) : null}

            {emptyItems.length > 0 ? (
              <QuantityCard
                title="Empty Cylinders Collected"
                items={emptyItems}
                countLabel="Expected"
                quantities={quantities}
                onChange={setItemQuantity}
              />
            ) : null}

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Exchange Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cylinders Delivered</Text>
                <Text style={styles.summaryValue}>{totalDelivered}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Empties Collected</Text>
                <Text style={styles.summaryValue}>{totalCollected}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalLabel}>Net Difference</Text>
                <Text
                  style={[
                    styles.summaryTotalValue,
                    netDifference === 0 ? styles.summaryTotalNeutral : styles.summaryTotalWarn,
                  ]}
                >
                  {netDifference > 0 ? `+${netDifference}` : netDifference}
                </Text>
              </View>
            </View>

            <PaymentCollectionCard
              payableAmount={payableAmount}
              method={draft.paymentMethod}
              onMethodChange={setPaymentMethod}
              split={draft.paymentSplit}
              onSplitChange={setPaymentSplit}
              partialAmountInput={draft.partialAmountInput}
              onPartialAmountChange={setPartialAmountInput}
              partialAmount={partialAmount}
              partialAmountError={partialAmountError}
              qrAmount={qrAmount}
            />

            <View>
              <Text style={styles.notesLabel}>Notes (Optional)</Text>
              <TextInput
                value={draft.notes}
                onChangeText={setNotes}
                placeholder="Add any notes about delivery..."
                placeholderTextColor={Colors.textPlaceholder}
                multiline
                style={styles.notesInput}
              />
            </View>
          </ScrollView>

          <UpdateOrderSheet
            visible={isUpdateSheetOpen}
            orderNumber={activeDelivery.orderNumber}
            currentItems={cylinderItems}
            onClose={closeUpdateSheet}
            onConfirm={handleConfirmUpdate}
          />

          <View style={styles.footer}>
            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}
            <Button label="Proceed to OTP" onPress={handleProceed} loading={isLoading} />
          </View>
        </>
      )}
    </View>
  );
};
