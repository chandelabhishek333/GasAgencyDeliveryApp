import React from 'react';
import { ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../components/layout/Header';
import { Button } from '../../../components/common/Button';
import { QuantityStepper } from '../../../components/delivery/QuantityStepper';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useDeliveryProof } from './useDeliveryProof';
import type { DeliveryProofScreenProps } from './types';

/** Screen 8 — Confirm Delivery: delivered/collected quantities + notes. */
export const DeliveryProofScreen: React.FC<DeliveryProofScreenProps> = ({ navigation }) => {
  const {
    activeDelivery,
    draft,
    cylinderItem,
    emptyItem,
    isLoading,
    error,
    setDeliveredQuantity,
    setEmptyCollectedQuantity,
    setNotes,
    handleProceed,
    handleBack,
  } = useDeliveryProof(navigation);

  const netDifference = draft ? draft.deliveredQuantity - draft.emptyCollectedQuantity : 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgCard} />
      <Header title="Confirm Delivery" onBackPress={handleBack} />

      {!activeDelivery || !draft ? (
        <Text style={styles.errorText}>{error ?? 'No active delivery selected.'}</Text>
      ) : (
        <>
          <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Delivered Quantity</Text>
              <View style={styles.itemRow}>
                <Text style={styles.itemIcon}>🛢️</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemLabel}>{cylinderItem?.label ?? '19 KG Cylinder'}</Text>
                  <Text style={styles.itemSub}>Ordered: {cylinderItem?.quantity ?? 0}</Text>
                </View>
                <QuantityStepper value={draft.deliveredQuantity} onChange={setDeliveredQuantity} min={0} />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Empty Cylinders Collected</Text>
              <View style={styles.itemRow}>
                <Text style={styles.itemIcon}>📦</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemLabel}>{emptyItem?.label ?? 'Empty Cylinder'}</Text>
                  <Text style={styles.itemSub}>Expected: {emptyItem?.quantity ?? 0}</Text>
                </View>
                <QuantityStepper
                  value={draft.emptyCollectedQuantity}
                  onChange={setEmptyCollectedQuantity}
                  min={0}
                />
              </View>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Exchange Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cylinders Delivered</Text>
                <Text style={styles.summaryValue}>{draft.deliveredQuantity}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Empties Collected</Text>
                <Text style={styles.summaryValue}>{draft.emptyCollectedQuantity}</Text>
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

          <View style={styles.footer}>
            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}
            <Button label="Proceed to OTP" onPress={handleProceed} loading={isLoading} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};
