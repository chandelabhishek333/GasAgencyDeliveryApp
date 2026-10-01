import React from 'react';
import { FlatList, Pressable, StatusBar, Text, View } from 'react-native';
import { Header } from '../../../components/layout/Header';
import { Badge } from '../../../components/common/Badge';
import { Loader } from '../../../components/common/Loader';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useOrderHistory } from './useOrderHistory';
import type { OrderHistoryScreenProps } from './types';
import { formatDeliveryDate } from '../../../utils/formatShortDate';
import type { HistoryDeliveryEntry, OrderHistoryPeriod } from '../../../types';

const PERIOD_TABS: Array<{ key: OrderHistoryPeriod; label: string }> = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'all', label: 'All' },
];

/** Delivery History: period tabs + one card per finished delivery (GET /deliveries/history). */
export const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ navigation }) => {
  const { period, setPeriod, history, isInitialLoading, error, handleBack } =
    useOrderHistory(navigation);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgCard} />
      <Header title="Delivery History" onBackPress={handleBack} />

      <View style={styles.content}>
        <View style={styles.tabsRow}>
          {PERIOD_TABS.map((tab) => {
            const isActive = period === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setPeriod(tab.key)}
                style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
              >
                <Text style={isActive ? styles.tabTextActive : styles.tabTextInactive}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {isInitialLoading ? (
          <Loader label="Loading history..." />
        ) : (
          <>
            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }: { item: HistoryDeliveryEntry }) => {
                const isFailed = item.status === 'failed';
                const when = item.completedAt
                  ? `Delivered at ${item.completedAt}`
                  : item.deliveryDate
                    ? formatDeliveryDate(item.deliveryDate)
                    : '';
                return (
                  <View style={styles.card}>
                    <View style={styles.topRow}>
                      <View>
                        <Text style={styles.orderId}>#{item.orderNumber}</Text>
                        {when ? <Text style={styles.time}>{when}</Text> : null}
                      </View>
                      <Badge
                        label={isFailed ? 'Failed' : 'Delivered ✅'}
                        variant={isFailed ? 'failed' : 'delivered'}
                        size="sm"
                      />
                    </View>
                    <View style={styles.bottomRow}>
                      <Text style={styles.customerName} numberOfLines={1}>
                        {item.customerName}
                      </Text>
                      {item.itemsSummary ? (
                        <View style={styles.itemChip}>
                          <Text style={styles.itemChipText}>{item.itemsSummary}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No deliveries in this period.</Text>
              }
            />
          </>
        )}
      </View>
    </View>
  );
};
