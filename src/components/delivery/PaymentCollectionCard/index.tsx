import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, Text, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from '../../common/Button';
import { Colors } from '../../../theme';
import { formatRupees } from '../../../utils/formatRupees';
import { PAYMENT_METHOD_LABEL, PAYMENT_SPLIT_LABEL } from '../../../utils/paymentMeta';
import { styles } from './styles';
import type { DeliveryPaymentMethod, DeliveryPaymentSplit } from '../../../types';
import type { PaymentCollectionCardProps } from './types';

const METHOD_OPTIONS: { value: DeliveryPaymentMethod; label: string }[] = [
  { value: 'cash', label: PAYMENT_METHOD_LABEL.cash },
  { value: 'upiQr', label: PAYMENT_METHOD_LABEL.upiQr },
];

/** Cash gets a ₹ badge; QR / UPI a QR glyph — both drawn, not emoji. */
const MethodIcon: React.FC<{ method: DeliveryPaymentMethod; selected: boolean }> = ({
  method,
  selected,
}) =>
  method === 'cash' ? (
    <View style={[styles.rupeeBadge, selected && styles.rupeeBadgeSelected]}>
      <Text style={[styles.rupeeText, selected && styles.rupeeTextSelected]}>₹</Text>
    </View>
  ) : (
    <Ionicons
      name="qr-code-outline"
      size={24}
      color={selected ? Colors.primary : Colors.textMuted}
    />
  );

/**
 * Placeholder QR card: a real dynamic UPI QR needs a backend / payment
 * gateway endpoint (none in the API yet) and a QR renderer. This shows the
 * amount to collect and the waiting state so the flow can be exercised.
 */
const QrCard: React.FC<{ amount: number }> = ({ amount }) => (
  <RevealOnMount>
    <View style={styles.qrCard}>
      <View style={styles.qrBox}>
        <Ionicons name="qr-code" size={112} color={Colors.textSecondary} />
        <Text style={styles.qrBrand}>MBGA · UPI</Text>
      </View>
      <Text style={styles.qrAmount}>Scan & Pay {formatRupees(amount)}</Text>
      <View style={styles.qrWaitingRow}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.qrWaitingText}>Waiting for customer payment confirmation</Text>
      </View>
    </View>
  </RevealOnMount>
);

const SPLIT_OPTIONS: { value: DeliveryPaymentSplit; label: string }[] = [
  { value: 'full', label: PAYMENT_SPLIT_LABEL.full },
  { value: 'partial', label: PAYMENT_SPLIT_LABEL.partial },
];

/** Fades + slides its children in on mount — used for the partial-amount field. */
const RevealOnMount: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  }, [progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] });
  return (
    <Animated.View style={{ opacity: progress, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

/**
 * Confirm Delivery's "Payment Collection" card: Cash vs Dynamic QR/UPI,
 * then Full vs Partial. Full shows the payable amount; Partial reveals
 * an amount input. Presentational only — parsing and validation live in
 * the screen's hook.
 */
export const PaymentCollectionCard: React.FC<PaymentCollectionCardProps> = ({
  payableAmount,
  method,
  onMethodChange,
  split,
  onSplitChange,
  partialAmountInput,
  onPartialAmountChange,
  partialAmount,
  partialAmountError,
  qrAmount,
  testID,
}) => {
  const [isQrShown, setQrShown] = useState(false);

  // Any change to method, split or amount invalidates a generated QR.
  useEffect(() => {
    setQrShown(false);
  }, [method, split, qrAmount]);

  const canGenerateQr = method === 'upiQr' && qrAmount !== null;

  return (
    <View style={styles.card} testID={testID}>
      <Text style={styles.cardTitle}>Payment Collection</Text>

      <Text style={styles.sectionLabel}>Select Payment Method</Text>
      <View style={styles.methodRow}>
        {METHOD_OPTIONS.map((option) => {
          const selected = option.value === method;
          return (
            <Pressable
              key={option.value}
              onPress={() => onMethodChange(option.value)}
              style={[styles.methodOption, selected && styles.methodOptionSelected]}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}>
              <MethodIcon method={option.value} selected={selected} />
              <Text style={[styles.methodLabel, selected && styles.methodLabelSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.splitTrack}>
        {SPLIT_OPTIONS.map((option) => {
          const selected = option.value === split;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSplitChange(option.value)}
              style={[styles.splitPill, selected && styles.splitPillSelected]}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}>
              <Text style={[styles.splitLabel, selected && styles.splitLabelSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {split === 'full' ? (
        <View style={styles.payableRow}>
          <Text style={styles.payableLabel}>Payable</Text>
          <Text style={styles.payableValue}>{formatRupees(payableAmount)}</Text>
        </View>
      ) : (
        <RevealOnMount>
          <Text style={styles.inputLabel}>Enter Partial Amount to Collect (₹)</Text>
          <View style={[styles.inputWrap, partialAmountError ? styles.inputWrapError : null]}>
            <Text style={styles.inputPrefix}>₹</Text>
            <TextInput
              value={partialAmountInput}
              onChangeText={onPartialAmountChange}
              placeholder="e.g. 5,000"
              placeholderTextColor={Colors.textPlaceholder}
              keyboardType="numeric"
              style={styles.input}
              accessibilityLabel="Partial amount to collect in rupees"
            />
            <Text style={styles.inputSuffix}>of {formatRupees(payableAmount)}</Text>
          </View>
          {partialAmountError ? (
            <Text style={styles.errorText}>{partialAmountError}</Text>
          ) : (
            <Text style={styles.helperText}>
              {partialAmount !== null
                ? `Remaining balance of ${formatRupees(payableAmount - partialAmount)} will be marked as pending.`
                : 'Remaining balance will be marked as pending.'}
            </Text>
          )}
        </RevealOnMount>
      )}

      {canGenerateQr && !isQrShown ? (
        <Button label="Generate QR" onPress={() => setQrShown(true)} variant="primary" />
      ) : null}
      {canGenerateQr && isQrShown && qrAmount !== null ? <QrCard amount={qrAmount} /> : null}
    </View>
  );
};
