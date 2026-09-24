import React from 'react';
import { FlatList, Pressable, StatusBar, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loader } from '../../../components/common/Loader';
import { OrderCard } from '../../../components/delivery/OrderCard';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useOrderList } from './useOrderList';
import type { OrderListScreenProps } from './types';
import type { OrderStatusFilter } from '../../../store/slices/ordersSlice';
import type { Order } from '../../../types';

const FILTER_TABS: Array<{ key: OrderStatusFilter; label: (n: { all: number; pending: number; inProgress: number }) => string }> = [
  { key: 'all', label: (n) => `All (${n.all})` },
  { key: 'pending', label: (n) => `Pending (${n.pending})` },
  { key: 'in_progress', label: (n) => `In Progress (${n.inProgress})` },
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

        <View style={styles.tabsRow}>
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
        </View>

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
