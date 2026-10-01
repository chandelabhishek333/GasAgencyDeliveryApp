import React from 'react';
import { Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../components/layout/Header';
import { Button } from '../../../components/common/Button';
import { OTPInput } from '../../../components/common/OTPInput';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useCustomerOTP } from './useCustomerOTP';
import type { CustomerOTPScreenProps } from './types';

/** Screen 9 — Customer OTP: the delivery-closing OTP entered by the customer. */
export const CustomerOTPScreen: React.FC<CustomerOTPScreenProps> = ({ navigation }) => {
  const {
    activeDelivery,
    otp,
    setOtp,
    isComplete,
    isLoading,
    error,
    secondsRemaining,
    handleVerify,
    handleResend,
    handleCallCustomer,
    handleBack,
  } = useCustomerOTP(navigation);

  const formattedTimer = `00:${String(secondsRemaining).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgWhite} />
      <Header title="Customer OTP" onBackPress={handleBack} />

      <View style={styles.content}>
        {activeDelivery ? (
          <View style={styles.customerChip}>
            <Text style={styles.customerChipText}>
              Verifying delivery for {activeDelivery.customer.name}
            </Text>
          </View>
        ) : null}

        <Text style={styles.title}>Enter Customer OTP</Text>
        <Text style={styles.subtitle}>
          {'Ask the customer for the 4-digit OTP\nto confirm delivery.'}
        </Text>

        <View style={styles.otpRow}>
          <OTPInput value={otp} onChangeText={setOtp} error={Boolean(error)} autoFocus />
        </View>

        {secondsRemaining > 0 ? (
          <Text style={styles.resend}>
            Resend OTP in <Text style={styles.resendHighlight}>{formattedTimer}</Text>
          </Text>
        ) : (
          <Pressable onPress={handleResend} accessibilityRole="button">
            <Text style={[styles.resend, styles.resendLink]}>Resend OTP</Text>
          </Pressable>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🛡️</Text>
          <Text style={styles.infoText}>
            This OTP confirms successful delivery and cylinder exchange.
          </Text>
        </View>

        <View style={styles.troubleSection}>
          <Text style={styles.troubleText}>Trouble receiving OTP?</Text>
          <Pressable onPress={handleCallCustomer} accessibilityRole="button">
            <Text style={styles.troubleLink}>📞 Call Customer</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          label="Verify OTP"
          onPress={handleVerify}
          variant="secondary"
          disabled={!isComplete}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};
