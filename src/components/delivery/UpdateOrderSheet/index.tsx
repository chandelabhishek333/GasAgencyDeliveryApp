import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../common/Button';
import { QuantityStepper } from '../QuantityStepper';
import { CYLINDER_CATALOG } from '../../../constants/cylinderCatalog';
import { styles } from './styles';
import type { UpdateOrderSheetProps } from './types';

type SheetRow = { cylinderType: string; label: string };

/** Every catalog type, plus any type already on the order that the catalog doesn't list (so it's never dropped). */
const rowsFor = (currentItems: UpdateOrderSheetProps['currentItems']): SheetRow[] => [
  ...CYLINDER_CATALOG,
  ...currentItems.filter((item) => !CYLINDER_CATALOG.some((entry) => entry.cylinderType === item.cylinderType)),
];

/** cylinderType -> the order's current quantity (0 when not in the order). */
const countsFromOrder = (rows: SheetRow[], currentItems: UpdateOrderSheetProps['currentItems']): Record<string, number> =>
  Object.fromEntries(
    rows.map((row) => [row.cylinderType, currentItems.find((item) => item.cylinderType === row.cylinderType)?.quantity ?? 0]),
  );

/**
 * Bottom sheet for editing the active delivery's cylinder types: every
 * catalog type has a stepper, pre-filled with the order's current count,
 * so the driver can change existing types, add new ones, or set one to 0
 * to remove it. "Confirm Update" sends the whole set to PUT update-items
 * (the server re-prices the order) and is enabled only when something
 * changed and at least one cylinder remains.
 */
export const UpdateOrderSheet: React.FC<UpdateOrderSheetProps> = ({
  visible,
  orderNumber,
  currentItems,
  submitting = false,
  onClose,
  onConfirm,
}) => {
  const insets = useSafeAreaInsets();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [initialCounts, setInitialCounts] = useState<Record<string, number>>({});

  // Re-seed from the order each time the sheet opens (not on every parent re-render).
  useEffect(() => {
    if (visible) {
      const seeded = countsFromOrder(rowsFor(currentItems), currentItems);
      setCounts(seeded);
      setInitialCounts(seeded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const rows = rowsFor(currentItems);
  const selections = rows.map(({ cylinderType, label }) => ({ cylinderType, label, quantity: counts[cylinderType] ?? 0 }));
  const hasChanges = selections.some((item) => item.quantity !== (initialCounts[item.cylinderType] ?? 0));
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
            {rows.map((item) => (
              <View key={item.cylinderType} style={styles.row}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <QuantityStepper
                  value={counts[item.cylinderType] ?? 0}
                  onChange={(quantity) => setCounts((current) => ({ ...current, [item.cylinderType]: quantity }))}
                  min={0}
                />
              </View>
            ))}
          </ScrollView>

          <Button
            label="Confirm Update"
            onPress={() => onConfirm(selections)}
            loading={submitting}
            disabled={!hasChanges || !hasCylinders}
          />
        </View>
      </View>
    </Modal>
  );
};
