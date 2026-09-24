import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
import { Header } from '../../components/layout/Header';
import { ComingSoon } from '../../components/common/ComingSoon';
import { Colors } from '../../theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgWhite },
});

interface SupportScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

/** Reached from Profile's "Help & Support" row — no support content is designed yet. */
export const SupportScreen: React.FC<SupportScreenProps> = ({ navigation }) => (
  <View style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor={Colors.bgWhite} />
    <Header title="Help & Support" onBackPress={() => navigation.goBack()} />
    <ComingSoon
      icon="❓"
      title="Help & Support"
      message="Support articles and contact options are coming soon."
    />
  </View>
);
