import React from 'react';
import { Pressable, RefreshControl, ScrollView, StatusBar, Switch, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { Colors } from '../../theme';
import { styles } from './styles';
import { useHomeScreen } from './useHomeScreen';
import type { HomeScreenProps } from './types';

type StatKey = 'pending' | 'outForDelivery' | 'completed';

const STAT_ITEMS: Array<{ key: StatKey; label: string; cellStyle: ViewStyle; textStyle: TextStyle }> = [
  { key: 'pending', label: 'Pending', cellStyle: styles.statPending, textStyle: styles.statPendingText },
  { key: 'outForDelivery', label: 'In Progress', cellStyle: styles.statInProgress, textStyle: styles.statInProgressText },
  { key: 'completed', label: 'Completed', cellStyle: styles.statCompleted, textStyle: styles.statCompletedText },
];

/** Screen 4 — Dashboard. The bottom tab bar is owned by MainTabNavigator, not this screen. */
export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    refreshing,
    handleRefresh,
    driver,
    initials,
    greeting,
    todayDate,
    nextDeliveryDate,
    isInitialLoading,
    error,
    stats,
    nextDelivery,
    cylinderRows,
    vehicleStock,
    shiftSummary,
    handleToggleDuty,
    handleViewAllPress,
    handleNextDeliveryPress,
  } = useHomeScreen(navigation);

  const isOnDuty = driver?.onDuty !== false;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={styles.greetingLine}>
              {greeting} {driver?.name ?? ''}
            </Text>
            <Text style={styles.vehicleText}>Emp Code: {driver?.employeeCode || '—'}</Text>
          </View>
        </View>
      </View>
      </SafeAreaView>

      {isInitialLoading ? (
        <Loader label="Loading your dashboard..." />
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        >
          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <View style={styles.topGroup}>
          {/* Duty Status Toggle */}
          <View style={styles.dutyCard}>
            <View style={styles.dutyCardLeft}>
              <View style={[styles.dutyDot, isOnDuty ? styles.dutyDotOn : styles.dutyDotOff]} />
              <View>
                <Text style={styles.dutyCardTitle}>
                  {isOnDuty ? 'You are Online / On Duty' : 'You are Offline / Off Duty'}
                </Text>
                <Text style={styles.dutyCardSubtitle}>
                  {isOnDuty ? 'Ready to accept deliveries' : 'Deliveries paused'}
                </Text>
              </View>
            </View>
            <Switch
              value={isOnDuty}
              onValueChange={handleToggleDuty}
              trackColor={{ false: Colors.borderLight, true: Colors.successLight }}
              thumbColor={isOnDuty ? Colors.successGreen : Colors.textLight}
              ios_backgroundColor={Colors.borderLight}
            />
          </View>

          {/* Today's Deliveries */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.todayLabel}>Today's Deliveries</Text>
                <View style={styles.todayCountRow}>
                  <Text style={styles.todayCount}>{stats.total}</Text>
                  <Text style={styles.todayCountUnit}>Orders</Text>
                </View>
              </View>
              <Text style={styles.dateBadge}>{todayDate}</Text>
            </View>

            <View style={styles.statsGrid}>
              {STAT_ITEMS.map((item) => (
                <View key={item.key} style={[styles.statCell, item.cellStyle]}>
                  <Text style={[styles.statValue, item.textStyle]}>{stats[item.key]}</Text>
                  <Text style={[styles.statLabel, item.textStyle]}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Vehicle Cylinder Stock */}
          <View style={styles.vehicleGrid}>
            <View style={styles.vehicleCell}>
              <Text style={styles.vehicleLabel}>Truck Full Stock</Text>
              <View style={styles.vehicleValueRow}>
                <Text style={[styles.vehicleValue, styles.vehicleValueBlue]}>
                  {vehicleStock.truckFullStock ?? '—'}
                  {vehicleStock.truckCapacity !== undefined ? ` / ${vehicleStock.truckCapacity}` : ''}
                </Text>
                <Text style={styles.vehicleUnit}>Cyl</Text>
              </View>
            </View>
            <View style={styles.vehicleCell}>
              <Text style={styles.vehicleLabel}>Empty Collected</Text>
              <View style={styles.vehicleValueRow}>
                <Text style={[styles.vehicleValue, styles.vehicleValueAmber]}>
                  {vehicleStock.emptyCollected !== null ? String(vehicleStock.emptyCollected).padStart(2, '0') : '—'}
                </Text>
                <Text style={styles.vehicleUnit}>Units</Text>
              </View>
            </View>
          </View>

          {/* Next Delivery */}
          <View style={styles.card}>
            {nextDelivery ? (
              <Pressable onPress={handleNextDeliveryPress}>
                <View style={styles.nextTopRow}>
                  <View style={styles.nextPill}>
                    <Text style={styles.nextPillText}>NEXT DELIVERY</Text>
                  </View>
                  <Text style={styles.nextDate}>{nextDeliveryDate}</Text>
                </View>
                <View style={styles.nextHeaderRow}>
                  <Text style={styles.nextTitle}>
                    {nextDelivery.customer.name} (#{nextDelivery.orderNumber})
                  </Text>
                  <View style={styles.nextArrowButton}>
                    <Text style={styles.nextArrowText}>➤</Text>
                  </View>
                </View>
                <Text style={styles.nextAddress}>
                  📍 {nextDelivery.customer.address}
                  {nextDelivery.distanceKm !== undefined ? ` • ${nextDelivery.distanceKm} km away` : ''}
                </Text>
                {cylinderRows.length > 0 ? (
                  <View style={styles.cylinderRowsContainer}>
                    {cylinderRows.map((row) => (
                      <View key={row.key} style={styles.cylinderRow}>
                        <Text style={styles.cylinderDeliveryText}>{row.delivery ?? ''}</Text>
                        {/* Always rendered (even when empty) so every row's collect column starts at the same x. */}
                        <Text style={styles.cylinderCollectText}>{row.collect ?? ''}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </Pressable>
            ) : (
              <Text style={styles.emptyNextText}>🎉 No upcoming deliveries right now.</Text>
            )}
          </View>

          {/* Shift Performance / Summary */}
          <View style={styles.card}>
            <Text style={styles.shiftTitle}>Shift Performance / Summary</Text>
            <View style={styles.shiftGrid}>
              <View style={styles.shiftCell}>
                <Text style={styles.shiftValue}>{shiftSummary.distanceCovered}</Text>
                <Text style={styles.shiftLabel}>Covered</Text>
              </View>
              <View style={[styles.shiftCell, styles.shiftCellDivider]}>
                <Text style={styles.shiftValue}>{shiftSummary.timeOnRoad}</Text>
                <Text style={styles.shiftLabel}>On Road</Text>
              </View>
              <View style={styles.shiftCell}>
                <Text style={styles.shiftValue}>{shiftSummary.cashToCollect}</Text>
                <Text style={styles.shiftLabel}>COD Pending</Text>
              </View>
            </View>
          </View>
          </View>

          <View style={styles.bottomGroup}>
          {/* Safety Banner */}
          <View style={styles.safetyBanner}>
            <Text style={styles.safetyText}>
              Complete deliveries safely • <Text style={styles.safetyBold}>Drive Safe. Deliver Happiness.</Text>
            </Text>
          </View>

          <Button
            label={`View All Deliveries (${stats.total}) →`}
            onPress={handleViewAllPress}
            size="sm"
            style={styles.ctaButtonOverride}
          />
          </View>
        </ScrollView>
      )}

    </View>
  );
};
