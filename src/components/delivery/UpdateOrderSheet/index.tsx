import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../common/Button';
import { QuantityStepper } from '../QuantityStepper';
import { CYLINDER_CATALOG } from '../../../constants/cylinderCatalog';
import { cylinderSizeKey } from '../../../utils/cylinderSize';
import { styles } from './styles';
import type { UpdateOrderSheetProps } from './types';

/** Catalog label -> the order's current quantity for that size (0 when not in the order). */
const countsFromOrder = (currentItems: UpdateOrderSheetProps['currentItems']): Record<string, number> =>
  Object.fromEntries(
    CYLINDER_CATALOG.map((catalogItem) => {
      const size = cylinderSizeKey(catalogItem.label);
      const match = currentItems.find((item) => cylinderSizeKey(item.label) === size);
      return [catalogItem.label, match?.quantity ?? 0];
    }),
  );

/**
 * Bottom sheet for editing the active delivery's cylinder types: every
 * catalog type has a stepper, pre-filled with the order's current count,
 * so the driver can change existing types, add new ones, or set one to 0
 * to remove it. "Confirm Update" applies the whole set at once and is
 * enabled only when something changed and at least one cylinder remains.
 */
export const UpdateOrderSheet: React.FC<UpdateOrderSheetProps> = ({
  visible,
  orderNumber,
  currentItems,
  onClose,
  onConfirm,
}) => {
  const insets = useSafeAreaInsets();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [initialCounts, setInitialCounts] = useState<Record<string, number>>({});

  // Re-seed from the order each time the sheet opens (not on every parent re-render).
  useEffect(() => {
    if (visible) {
      const seeded = countsFromOrder(currentItems);
      setCounts(seeded);
      setInitialCounts(seeded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const selections = CYLINDER_CATALOG.map((item) => ({ ...item, quantity: counts[item.label] ?? 0 }));
  const hasChanges = selections.some((item) => item.quantity !== (initialCounts[item.label] ?? 0));
  const hasCylinders = selections.some((item) => item.quantity > 0);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={onClose} accessibilityLabel="Close" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Update Order Items</Text>
              <View style={styles.orderBadge}>
                <Text style={styles.orderBadgeText}>#{orderNumber}</Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Close">
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {CYLINDER_CATALOG.map((item) => (
              <View key={item.label} style={styles.row}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <QuantityStepper
                  value={counts[item.label] ?? 0}
                  onChange={(quantity) => setCounts((current) => ({ ...current, [item.label]: quantity }))}
                  min={0}
                />
              </View>
            ))}
          </ScrollView>

          <Button
            label="Confirm Update"
            onPress={() => onConfirm(selections)}
            disabled={!hasChanges || !hasCylinders}
          />
        </View>
      </View>
    </Modal>
  );
};
