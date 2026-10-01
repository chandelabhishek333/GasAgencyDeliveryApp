import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';

export interface CompletedOrderDetailScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
  route: { params: { orderId: string } };
}
