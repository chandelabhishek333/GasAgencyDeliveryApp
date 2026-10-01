import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileMainScreen } from '../../screens/Profile/ProfileMain';
import { OrderHistoryScreen } from '../../screens/Orders/OrderHistory';
import { CompletedOrderDetailScreen } from '../../screens/Orders/CompletedOrderDetail';
import { SupportScreen } from '../../screens/Support';
import { ROUTES } from '../../constants/routes';

export type ProfileStackParamList = {
  [ROUTES.PROFILE_MAIN]: undefined;
  [ROUTES.ORDER_HISTORY]: undefined;
  [ROUTES.COMPLETED_ORDER_DETAIL]: { orderId: string };
  [ROUTES.SUPPORT]: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

/**
 * The Profile tab's stack. Hosts OrderHistory per the task prompt's
 * nav tree, even though it physically lives under src/screens/Orders/,
 * plus CompletedOrderDetail so a history card opens its receipt without
 * leaving the Profile tab.
 * Support is included since ProfileMain's "Help & Support" row
 * navigates there. Notifications is its own bottom tab (see
 * MainTabNavigator), not nested here. EditProfile/Settings are
 * documented in src/navigation/README.md but have no screens built
 * yet, so they're omitted rather than referencing nonexistent
 * components.
 */
export const ProfileStack: React.FC = () => (
  <Stack.Navigator initialRouteName={ROUTES.PROFILE_MAIN} screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.PROFILE_MAIN} component={ProfileMainScreen} />
    <Stack.Screen name={ROUTES.ORDER_HISTORY} component={OrderHistoryScreen} />
    <Stack.Screen name={ROUTES.COMPLETED_ORDER_DETAIL} component={CompletedOrderDetailScreen} />
    <Stack.Screen name={ROUTES.SUPPORT} component={SupportScreen} />
  </Stack.Navigator>
);
