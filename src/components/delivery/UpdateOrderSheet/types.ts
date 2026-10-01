export interface UpdateOrderSelection {
  label: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateOrderSheetProps {
  visible: boolean;
  orderNumber: string;
  /** The order's current delivered lines — pre-fill the matching steppers (by cylinder size). */
  currentItems: Array<{ label: string; quantity: number }>;
  onClose: () => void;
  /**
   * Called with every catalog type and its count, including 0 — the
   * reducer adds, updates or removes lines to match (see updateOrderItems).
   */
  onConfirm: (selections: UpdateOrderSelection[]) => void;
}
