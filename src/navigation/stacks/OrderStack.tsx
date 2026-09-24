import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrderListScreen } from '../../screens/Orders/OrderList';
import { OrderDetailScreen } from '../../screens/Orders/OrderDetail';
import { ActiveDeliveryScreen } from '../../screens/Delivery/ActiveDelivery';
import { DeliveryProofScreen } from '../../screens/Delivery/DeliveryProof';
import { CustomerOTPScreen } from '../../screens/Delivery/CustomerOTP';
import { DeliveryCompleteScreen } from '../../screens/Delivery/DeliveryComplete';
import { ROUTES } from '../../constants/routes';

export type OrderStackParamList = {
  [ROUTES.ORDER_LIST]: undefined;
  [ROUTES.ORDER_DETAIL]: { orderId: string };
  [ROUTES.ACTIVE_DELIVERY]: undefined;
  [ROUTES.DELIVERY_PROOF]: undefined;
  [ROUTES.CUSTOMER_OTP]: undefined;
  [ROUTES.DELIVERY_COMPLETE]: undefined;
};

const Stack = createNativeStackNavigator<OrderStackParamList>();

/**
 * The Deliveries tab's stack: OrderList -> OrderDetail -> the active-
 * delivery workflow (ActiveDelivery -> DeliveryProof -> CustomerOTP ->
 * DeliveryComplete). These four used to live in a separately-nested
 * DeliveryStack mounted as a screen here, but plain
 * `navigation.navigate(ROUTES.ACTIVE_DELIVERY)` from OrderDetail can't
 * resolve a screen inside an unfocused nested navigator — React
 * Navigation only bubbles NAVIGATE actions up to ancestors, never down
 * into a sibling's nested children, so that produced "was not handled
 * by any navigator" at runtime. Flattening them into this single stack
 * means every `navigate(ROUTES.X)` call in the flow (including
 * DeliveryComplete's jump back to ROUTES.ORDER_LIST) resolves directly
 * among siblings. OrderTracking is documented in
 * src/navigation/README.md but has no screen built yet, so it's
 * omitted here rather than referencing a nonexistent component.
 */
export const OrderStack: React.FC = () => (
  <Stack.Navigator initialRouteName={ROUTES.ORDER_LIST} screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.ORDER_LIST} component={OrderListScreen} />
    <Stack.Screen name={ROUTES.ORDER_DETAIL} component={OrderDetailScreen} />
    <Stack.Screen name={ROUTES.ACTIVE_DELIVERY} component={ActiveDeliveryScreen} />
    <Stack.Screen name={ROUTES.DELIVERY_PROOF} component={DeliveryProofScreen} />
    <Stack.Screen name={ROUTES.CUSTOMER_OTP} component={CustomerOTPScreen} />
    <Stack.Screen name={ROUTES.DELIVERY_COMPLETE} component={DeliveryCompleteScreen} />
  </Stack.Navigator>
);
