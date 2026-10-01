import React from 'react';
import { Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../components/layout/Header';
import { Button } from '../../../components/common/Button';
import { Colors } from '../../../theme';
import { styles } from './styles';
import { useActiveDelivery } from './useActiveDelivery';
import type { ActiveDeliveryScreenProps } from './types';

/** Rough urban-driving estimate (~3 min/km) — order.distanceKm is real mock data, this heuristic is not. */
const estimateEtaMinutes = (distanceKm: number): number => Math.max(1, Math.round(distanceKm * 3));

/** Start Delivery: static map illustration + POST verify-location. */
export const ActiveDeliveryScreen: React.FC<ActiveDeliveryScreenProps> = ({ navigation }) => {
  const {
    activeDelivery,
    isLocationCaptured,
    isLoading,
    error,
    handleAtLocation,
    handleOpenMaps,
    handleViewOrderDetails,
    handleBack,
  } = useActiveDelivery(navigation);

  const etaText =
    activeDelivery?.distanceKm !== undefined
      ? `${estimateEtaMinutes(activeDelivery.distanceKm)} mins away • ${activeDelivery.distanceKm} km`
      : null;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgWhite} />
      <Header title="Start Delivery" onBackPress={handleBack} />

      {!activeDelivery ? (
        <Text style={styles.errorText}>{error ?? 'No active delivery selected.'}</Text>
      ) : (
        <>
          <View style={styles.content}>
            <Text style={styles.title}>Verify your location</Text>

            <View style={styles.mapArea}>
              <View style={styles.roadLineDiagonal} />
              <View style={styles.roadLineVertical} />
              <View style={styles.pinWrap}>
                <View style={styles.pin}>
                  <Text style={styles.pinIcon}>📍</Text>
                </View>
              </View>
              <View style={styles.mapLabelChip}>
                <Text style={styles.mapLabelText}>{activeDelivery.customer.address}</Text>
              </View>
            </View>

            <Text style={styles.successText}>
              {isLocationCaptured
                ? "Customer's location is on file — tap below once you're there."
                : "First delivery here — your current location will be saved as the customer's location."}
            </Text>

            <View style={styles.addressCard}>
              <View style={styles.addressHeaderRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <View style={styles.addressInfo}>
                  <Text style={styles.locationName}>{activeDelivery.customer.name}</Text>
                  <Text style={styles.locationAddress}>{activeDelivery.customer.address}</Text>
                </View>
              </View>

              <View style={styles.addressMetaRow}>
                {etaText ? (
                  <View style={styles.etaChip}>
                    <Text style={styles.etaChipText}>{etaText}</Text>
                  </View>
                ) : null}
                <Pressable onPress={handleOpenMaps} accessibilityRole="button">
                  <Text style={styles.mapsLink}>🧭 Open Google Maps</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Button
              label="I'm at the Location"
              onPress={handleAtLocation}
              size="sm"
              loading={isLoading}
            />
            <Button
              label="View Order Details"
              onPress={handleViewOrderDetails}
              variant="outline"
              size="sm"
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};
