import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

export interface VehicleStock {
  truckFullStock: number;
  truckCapacity: number;
  emptyCollected: number;
}

export interface ShiftSummary {
  distanceCovered: string;
  timeOnRoad: string;
  cashToCollect: string;
}
