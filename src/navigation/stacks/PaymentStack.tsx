import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaymentMethodsScreen } from '../../screens/Payments/PaymentMethods';
import { PaymentHistoryScreen } from '../../screens/Payments/PaymentHistory';
import { ROUTES } from '../../constants/routes';

export type PaymentStackParamList = {
  [ROUTES.PAYMENT_METHODS]: undefined;
  [ROUTES.PAYMENT_HISTORY]: undefined;
};

const Stack = createNativeStackNavigator<PaymentStackParamList>();

/**
 * Not part of the 13-screen spec or the task prompt's nav tree —
 * nothing currently navigates here (no tab, no menu row). Built
 * because src/navigation/README.md documents this file and
 * src/api/services/paymentService.ts is already wired, ready for
 * whenever Payment screens are designed and this stack gets mounted
 * (e.g. as a Profile menu item or its own tab).
 */
export const PaymentStack: React.FC = () => (
  <Stack.Navigator initialRouteName={ROUTES.PAYMENT_METHODS} screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.PAYMENT_METHODS} component={PaymentMethodsScreen} />
    <Stack.Screen name={ROUTES.PAYMENT_HISTORY} component={PaymentHistoryScreen} />
  </Stack.Navigator>
);
