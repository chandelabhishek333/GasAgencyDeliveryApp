import React from 'react';
import { Pressable, StatusBar, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/common/Button';
import { OTPInput } from '../../../components/common/OTPInput';
import { Toast } from '../../../components/common/Toast';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useOTPVerification } from './useOTPVerification';
import type { OTPVerificationScreenProps } from './types';

const TOAST_DURATION_MS = 4000;

/** Screen 3 — Duty OTP verification. */
export const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = () => {
  const {
    otp,
    setOtp,
    isComplete,
    isLoading,
    error,
    secondsRemaining,
    successMessage,
    phone,
    handleVerify,
    handleResend,
    handleDismissSuccess,
  } = useOTPVerification();

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTimer = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <LinearGradient colors={[Colors.gradientOtpStart, Colors.gradientOtpEnd]} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Toast
        visible={Boolean(successMessage)}
        message={successMessage ?? ''}
        variant="success"
        position="top"
        duration={TOAST_DURATION_MS}
        onDismiss={handleDismissSuccess}
      />
      <View style={styles.content}>
        <View style={styles.glowWrap}>
          <Text style={styles.keyIcon}>🔑</Text>
        </View>

        <Text style={styles.title}>Enter Duty OTP</Text>
        <Text style={styles.subtitle}>Code sent to +91 {phone}</Text>

        <View style={styles.otpRow}>
          <OTPInput
            value={otp}
            onChangeText={setOtp}
            error={Boolean(error)}
            accentColor={Colors.primary}
            autoFocus
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {secondsRemaining > 0 ? (
          <Text style={styles.resend}>
            Resend OTP in <Text style={styles.resendHighlight}>{formattedTimer}</Text>
          </Text>
        ) : (
          <Pressable onPress={handleResend} accessibilityRole="button">
            <Text style={[styles.resend, styles.resendLink]}>Resend OTP</Text>
          </Pressable>
        )}

        <Button
          label="Verify & Start Duty"
          onPress={handleVerify}
          variant="secondary"
          disabled={!isComplete}
          loading={isLoading}
        />
      </View>

      <View style={styles.securityCard}>
        <Text>🔒</Text>
        <Text style={styles.securityText}>Secure Device Authentication</Text>
      </View>
      </SafeAreaView>
    </LinearGradient>
  );
};
