import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../theme';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchNotifications, fetchUnreadCount } from '../../../store/slices/notificationsSlice';
import { selectBadgeUnreadCount } from '../../../store/selectors/notificationsSelectors';
import { styles } from './styles';
import type { BottomTabBarProps, TabKey } from './types';

interface TabItem {
  key: TabKey;
  label: string;
  renderIcon: (color: string, focused: boolean) => React.ReactNode;
}

const ICON_SIZE = 24;

const TAB_ITEMS: TabItem[] = [
  {
    key: 'home',
    label: 'Home',
    renderIcon: (color, focused) => (
      <Ionicons name={focused ? 'home' : 'home-outline'} size={ICON_SIZE} color={color} />
    ),
  },
  {
    key: 'deliveries',
    label: 'Deliveries',
    renderIcon: (color, focused) => (
      <MaterialCommunityIcons
        name={focused ? 'truck-delivery' : 'truck-delivery-outline'}
        size={ICON_SIZE}
        color={color}
      />
    ),
  },
  {
    key: 'notifications',
    label: 'Notifications',
    renderIcon: (color, focused) => (
      <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={ICON_SIZE} color={color} />
    ),
  },
  {
    key: 'profile',
    label: 'Profile',
    renderIcon: (color, focused) => (
      <Ionicons name={focused ? 'person' : 'person-outline'} size={ICON_SIZE} color={color} />
    ),
  },
];

/**
 * The app's fixed 4-tab bar. Deliberately decoupled from
 * @react-navigation's BottomTabBarProps — when the tab navigator is
 * wired up (later group), its custom `tabBar` render prop maps
 * `state`/`navigation.navigate` onto `activeKey`/`onTabPress` here.
 *
 * Also owns the notifications fetch: it's mounted for the whole
 * authenticated session, so it's the natural place to keep the unread
 * badge fresh (from the server's unread-count endpoint), independent of
 * whichever tab is currently focused.
 */
export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeKey, onTabPress, testID }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const unreadCount = useAppSelector(selectBadgeUnreadCount);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]} testID={testID}>
      {TAB_ITEMS.map((tab) => {
        const isActive = tab.key === activeKey;
        const color = isActive ? Colors.navItemActive : Colors.navItemInactive;
        const tone = isActive ? styles.active : styles.inactive;
        const showBadge = tab.key === 'notifications' && unreadCount > 0;

        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={showBadge ? `${tab.label}, ${unreadCount} unread` : tab.label}
          >
            <View style={styles.iconWrap}>
              {tab.renderIcon(color, isActive)}
              {showBadge ? (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, tone]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};
