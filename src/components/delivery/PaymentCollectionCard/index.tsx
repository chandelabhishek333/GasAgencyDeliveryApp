import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, Text, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from '../../common/Button';
import { Colors } from '../../../theme';
import { formatRupees } from '../../../utils/formatRupees';
import { PAYMENT_METHOD_LABEL, PAYMENT_SPLIT_LABEL } from '../../../utils/paymentMeta';
import { styles } from './styles';
import type { DeliveryPaymentMethod, DeliveryPaymentSplit, GenerateQrResponse } from '../../../types';
import type { PaymentCollectionCardProps } from './types';

const METHOD_OPTIONS: { value: DeliveryPaymentMethod; label: string }[] = [
  { value: 'cash', label: PAYMENT_METHOD_LABEL.cash },
  { value: 'upi_qr', label: PAYMENT_METHOD_LABEL.upi_qr },
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

const formatCountdown = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

/**
 * The dynamic UPI QR from POST generate-qr: the server's QR image (the
 * glyph stands in when there's no image URL or it fails to load), the
 * exact amount, and a countdown to `expiresInSeconds` — once expired the
 * driver regenerates.
 */
const QrCard: React.FC<{ qr: GenerateQrResponse; onRegenerate: () => void; regenerating: boolean }> = ({
  qr,
  onRegenerate,
  regenerating,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(qr.expiresInSeconds);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setSecondsLeft(qr.expiresInSeconds);
    setImageFailed(false);
    if (qr.expiresInSeconds <= 0) {
      return undefined;
    }
    const timer = setInterval(() => setSecondsLeft((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearInterval(timer);
  }, [qr]);

  const isExpired = qr.expiresInSeconds > 0 && secondsLeft === 0;
  const showImage = Boolean(qr.qrImageUrl) && !imageFailed;

  return (
    <RevealOnMount>
      <View style={styles.qrCard}>
        <View style={[styles.qrBox, isExpired && styles.qrBoxExpired]}>
          {showImage ? (
            <Image
              source={{ uri: qr.qrImageUrl }}
              style={styles.qrImage}
              resizeMode="contain"
              onError={() => setImageFailed(true)}
              accessibilityLabel={`UPI QR code for ${formatRupees(qr.amount)}`}
            />
          ) : (
            <Ionicons name="qr-code" size={112} color={Colors.textSecondary} />
          )}
          <Text style={styles.qrBrand}>MBGA · UPI · #{qr.orderNumber}</Text>
        </View>
        <Text style={styles.qrAmount}>Scan & Pay {formatRupees(qr.amount)}</Text>
        {isExpired ? (
          <>
            <Text style={styles.errorText}>This QR has expired.</Text>
            <Button label="Generate New QR" onPress={onRegenerate} loading={regenerating} variant="outline" />
          </>
        ) : (
          <View style={styles.qrWaitingRow}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.qrWaitingText}>
              Waiting for customer payment
              {qr.expiresInSeconds > 0 ? ` · expires in ${formatCountdown(secondsLeft)}` : ''}
            </Text>
          </View>
        )}
      </View>
    </RevealOnMount>
  );
};

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
  qr,
  isGeneratingQr,
  qrError,
  onGenerateQr,
  testID,
}) => {
  const canGenerateQr = method !== 'cash' && qrAmount !== null;

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

      {canGenerateQr && !qr ? (
        <Button label="Generate QR" onPress={onGenerateQr} loading={isGeneratingQr} variant="primary" />
      ) : null}
      {canGenerateQr && qr ? (
        <QrCard qr={qr} onRegenerate={onGenerateQr} regenerating={isGeneratingQr} />
      ) : null}
      {canGenerateQr && qrError ? <Text style={styles.errorText}>{qrError}</Text> : null}
    </View>
  );
};
