import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

/** Van stock for Home's two tiles — null while not loaded (tile shows "—"). */
export interface VehicleStock {
  truckFullStock: number | null;
  /** Not provided by the live API (GET /driver/inventory) — the "/ N" part is shown only when known. */
  truckCapacity?: number;
  emptyCollected: number | null;
}

/**
 * One line of the Next Delivery card: a delivered cylinder type and the
 * empty collected for it. Either side is null when the order has no
 * counterpart (e.g. an empty with no matching delivered size).
 */
export interface CylinderRow {
  key: string;
  /** e.g. "5 × 19 KG Commercial" */
  delivery: string | null;
  /** e.g. "(Collect: 5 × 19 KG Empty)" */
  collect: string | null;
}

export interface ShiftSummary {
  distanceCovered: string;
  timeOnRoad: string;
  cashToCollect: string;
}
