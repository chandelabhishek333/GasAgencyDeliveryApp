/** GET /driver/profile `shiftStats` — today's running totals. */
export interface ShiftStats {
  completedDeliveriesToday: number;
  cashCollectedToday: number;
  totalEmptiesCollectedToday: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  role: string;
  onDuty: boolean;
  avatarInitials?: string;
  /** Only on GET /driver/profile — the login/`/me` identity has no shift stats. */
  shiftStats?: ShiftStats;
}

/** PATCH /driver/status response. */
export interface DutyStatusResponse {
  onDuty: boolean;
}

/** GET /driver/inventory `stockByType[]` — one cylinder type on the van. */
export interface CylinderStock {
  cylinderType: string;
  label: string;
  fullCount: number;
  emptyCount: number;
}

/** GET /driver/inventory — the van's live stock. */
export interface DriverInventory {
  totalFullCylinders: number;
  totalEmptyCylinders: number;
  activeDeliveriesCount: number;
  stockByType: CylinderStock[];
}
