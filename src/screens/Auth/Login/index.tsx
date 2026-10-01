import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/common/Button';
import { Toast } from '../../../components/common/Toast';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { PHONE_LENGTH, useLogin } from './useLogin';
import type { LoginScreenProps } from './types';

const LOGO_SOURCE = require('../../../assets/images/logos/mbga-logo.png');
const TOAST_DURATION_MS = 4000;

/** Screen 2 — Duty Login: phone number entry, sends the duty OTP. */
export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const {
    phone,
    isValidPhone,
    isLoading,
    error,
    logoutMessage,
    handleChangePhone,
    handleSendOtp,
    handleDismissError,
    handleDismissLogoutMessage,
  } = useLogin(navigation);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientLoginStart, Colors.gradientLoginEnd]}
        style={StyleSheet.absoluteFill}
      />
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <Toast
          visible={Boolean(error)}
          message={error ?? ''}
          variant="error"
          position="top"
          duration={TOAST_DURATION_MS}
          onDismiss={handleDismissError}
        />
        <Toast
          visible={Boolean(logoutMessage)}
          message={logoutMessage ?? ''}
          variant="success"
          position="top"
          duration={TOAST_DURATION_MS}
          onDismiss={handleDismissLogoutMessage}
        />
        <View style={styles.content}>
          <Image source={LOGO_SOURCE} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Welcome Partner!</Text>

          <View style={styles.dutyBadge}>
            <Text style={styles.dutyBadgeText}>Duty Login</Text>
          </View>

          <Text style={styles.subtitle}>{'Enter registered phone number\nto start duty'}</Text>

          <View style={styles.phoneRow}>
            <Text style={styles.flag}>🇮🇳</Text>
            <View style={styles.codeWrap}>
              <Text style={styles.code}>+91</Text>
            </View>
            <TextInput
              value={phone}
              onChangeText={handleChangePhone}
              placeholder="98765 43210"
              placeholderTextColor={Colors.textPlaceholder}
              keyboardType="number-pad"
              maxLength={PHONE_LENGTH}
              style={styles.phoneInput}
            />
          </View>

          <Button
            label="Send Duty OTP"
            onPress={handleSendOtp}
            loading={isLoading}
            disabled={!isValidPhone}
          />
        </View>
        <Text style={styles.footer}>🔒 Authorized Delivery Personnel Only</Text>
      </SafeAreaView>
    </View>
  );
};
