import React from 'react';
import { FlatList, Pressable, StatusBar, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Header } from '../../components/layout/Header';
import { Loader } from '../../components/common/Loader';
import { Colors } from '../../theme';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { styles } from './styles';
import { useNotificationsScreen } from './useNotificationsScreen';
import type { NotificationsScreenProps } from './types';
import type { Notification, NotificationType } from '../../types';

const ICON_BY_TYPE: Record<NotificationType, string> = {
  new_delivery: '🚚',
  delivery_confirmed: '✅',
  order_updated: '🔄',
  system: 'ℹ️',
};

const ICON_BOX_STYLE_BY_TYPE: Record<NotificationType, ViewStyle> = {
  new_delivery: styles.iconBoxNewDelivery,
  delivery_confirmed: styles.iconBoxDeliveryConfirmed,
  order_updated: styles.iconBoxOrderUpdated,
  system: styles.iconBoxSystem,
};

/**
 * Screen 13 — Notifications: All/Unread tabs + color-coded list.
 * Mounted directly as the Notifications bottom tab's root, so it has
 * no back button (same as Home/Deliveries/Profile's own roots).
 */
export const NotificationsScreen: React.FC<NotificationsScreenProps> = () => {
  const {
    tab,
    setTab,
    notifications,
    unreadCount,
    isLoading,
    handleNotificationPress,
    canMarkAllRead,
    handleMarkAllRead,
  } = useNotificationsScreen();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgWhite} />
      <Header
        title="Notifications"
        rightLabel={canMarkAllRead ? 'Mark all read' : undefined}
        onRightPress={canMarkAllRead ? handleMarkAllRead : undefined}
      />

      <View style={styles.content}>
        <View style={styles.tabsRow}>
          <Pressable
            onPress={() => setTab('all')}
            style={[styles.tab, tab === 'all' ? styles.tabActive : styles.tabInactive]}
          >
            <Text style={tab === 'all' ? styles.tabTextActive : styles.tabTextInactive}>All</Text>
          </Pressable>
          <Pressable
            onPress={() => setTab('unread')}
            style={[styles.tab, tab === 'unread' ? styles.tabActive : styles.tabInactive]}
          >
            <Text style={tab === 'unread' ? styles.tabTextActive : styles.tabTextInactive}>
              Unread ({unreadCount})
            </Text>
          </Pressable>
        </View>

        {isLoading ? (
          <Loader label="Loading notifications..." />
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }: { item: Notification }) => (
              <Pressable
                style={[styles.card, !item.isRead && styles.cardUnread]}
                onPress={() => handleNotificationPress(item)}
              >
                <View style={[styles.iconBox, ICON_BOX_STYLE_BY_TYPE[item.type]]}>
                  <Text style={styles.iconText}>{ICON_BY_TYPE[item.type]}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                  <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No notifications yet.</Text>}
          />
        )}
      </View>
    </View>
  );
};
