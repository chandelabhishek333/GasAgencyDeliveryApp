import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps as RNBottomTabBarProps } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../../screens/Home';
import { OrderStack } from '../stacks/OrderStack';
import { NotificationsScreen } from '../../screens/Notifications';
import { ProfileStack } from '../stacks/ProfileStack';
import { BottomTabBar } from '../../components/layout/BottomTabBar';
import type { TabKey } from '../../components/layout/BottomTabBar/types';
import { ROUTES } from '../../constants/routes';

export type MainTabParamList = {
  [ROUTES.HOME_TAB]: undefined;
  [ROUTES.DELIVERIES_TAB]: undefined;
  [ROUTES.NOTIFICATIONS]: undefined;
  [ROUTES.PROFILE_TAB]: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_KEY_BY_ROUTE_NAME: Record<string, TabKey> = {
  [ROUTES.HOME_TAB]: 'home',
  [ROUTES.DELIVERIES_TAB]: 'deliveries',
  [ROUTES.NOTIFICATIONS]: 'notifications',
  [ROUTES.PROFILE_TAB]: 'profile',
};

const ROUTE_NAME_BY_TAB_KEY: Record<TabKey, string> = {
  home: ROUTES.HOME_TAB,
  deliveries: ROUTES.DELIVERIES_TAB,
  notifications: ROUTES.NOTIFICATIONS,
  profile: ROUTES.PROFILE_TAB,
};

/**
 * Renders our design-system BottomTabBar instead of the default tab
 * bar, via React Navigation's official `tabBar` render-prop escape
 * hatch. This is where BottomTabBar now lives — Home and Order List
 * no longer mount their own copy (see their earlier "temporary"
 * comments, now resolved).
 */
const renderTabBar = (props: RNBottomTabBarProps): React.ReactElement => {
  const activeRouteName = props.state.routes[props.state.index].name;
  const activeKey = TAB_KEY_BY_ROUTE_NAME[activeRouteName] ?? 'home';

  const handleTabPress = (key: TabKey): void => {
    props.navigation.navigate(ROUTE_NAME_BY_TAB_KEY[key]);
  };

  return <BottomTabBar activeKey={activeKey} onTabPress={handleTabPress} />;
};

/** Home / Deliveries (OrderStack) / Notifications / Profile (ProfileStack). */
export const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    initialRouteName={ROUTES.HOME_TAB}
    screenOptions={{ headerShown: false }}
    tabBar={renderTabBar}
  >
    <Tab.Screen name={ROUTES.HOME_TAB} component={HomeScreen} />
    <Tab.Screen name={ROUTES.DELIVERIES_TAB} component={OrderStack} />
    <Tab.Screen name={ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
    <Tab.Screen name={ROUTES.PROFILE_TAB} component={ProfileStack} />
  </Tab.Navigator>
);
