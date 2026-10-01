import React from 'react';
import { FlatList, Pressable, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loader } from '../../../components/common/Loader';
import { OrderCard } from '../../../components/delivery/OrderCard';
import { Colors } from '../../../theme';
import { ORDER_STATUS_LABEL } from '../../../utils/orderStatusMeta';
import { styles } from './styles';
import { useOrderList } from './useOrderList';
import type { OrderListScreenProps } from './types';
import type { OrderStatusFilter } from '../../../store/slices/ordersSlice';
import type { Order } from '../../../types';

type StatusCounts = { all: number; pending: number; outForDelivery: number; completed: number };

const FILTER_TABS: Array<{ key: OrderStatusFilter; label: (n: StatusCounts) => string }> = [
  { key: 'all', label: (n) => `All (${n.all})` },
  { key: 'pending', label: (n) => `Pending (${n.pending})` },
  { key: 'out_for_delivery', label: (n) => `${ORDER_STATUS_LABEL.out_for_delivery} (${n.outForDelivery})` },
  { key: 'completed', label: (n) => `${ORDER_STATUS_LABEL.completed} (${n.completed})` },
];

/** Screen 5 — Today's Deliveries: search + status filter tabs + order list. */
export const OrderListScreen: React.FC<OrderListScreenProps> = ({ navigation }) => {
  const {
    orders,
    statusCounts,
    statusFilter,
    searchQuery,
    isInitialLoading,
    error,
    handleSearchChange,
    handleFilterChange,
    handleOrderPress,
  } = useOrderList(navigation);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgCard} />

      <View style={styles.content}>
        <Text style={styles.title}>Today's Deliveries</Text>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search customer or order no."
            placeholderTextColor={Colors.textPlaceholder}
            style={styles.searchInput}
          />
        </View>

        {/* Four tabs don't fit one row on a phone — scroll sideways rather than wrap or shrink the text. */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsRow}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => handleFilterChange(tab.key)}
                style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
              >
                <Text style={isActive ? styles.tabTextActive : styles.tabTextInactive}>
                  {tab.label(statusCounts)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {isInitialLoading ? (
          <Loader label="Loading deliveries..." />
        ) : (
          <>
            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }: { item: Order }) => (
                <OrderCard order={item} onPress={handleOrderPress} />
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No deliveries match this filter.</Text>}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};
