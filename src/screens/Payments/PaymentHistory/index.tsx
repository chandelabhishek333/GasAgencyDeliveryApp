import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
import { Header } from '../../../components/layout/Header';
import { ComingSoon } from '../../../components/common/ComingSoon';
import { Colors } from '../../../theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgWhite },
});

interface PaymentHistoryScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

/** Not part of the 13-screen spec — src/api/services/paymentService.ts is ready, but no screen was designed. */
export const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({ navigation }) => (
  <View style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor={Colors.bgWhite} />
    <Header title="Payment History" onBackPress={() => navigation.goBack()} />
    <ComingSoon icon="🧾" title="Payment History" message="Transaction history is coming soon." />
  </View>
);
