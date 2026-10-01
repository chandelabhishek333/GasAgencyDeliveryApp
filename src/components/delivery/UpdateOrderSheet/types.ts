export interface UpdateOrderSelection {
  cylinderType: string;
  label: string;
  quantity: number;
}

export interface UpdateOrderSheetProps {
  visible: boolean;
  orderNumber: string;
  /** The order's current delivered lines — pre-fill the matching steppers (by cylinderType). */
  currentItems: Array<{ cylinderType: string; label: string; quantity: number }>;
  /** True while the update-items request is in flight. */
  submitting?: boolean;
  onClose: () => void;
  /**
   * Called with every row and its count, including 0 — the full new set
   * of cylinder types for PUT update-items (zero rows are dropped there).
   */
  onConfirm: (selections: UpdateOrderSelection[]) => void;
}
