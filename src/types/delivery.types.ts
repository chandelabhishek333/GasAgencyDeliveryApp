import type { Order } from './order.types';

/** A delivery is an order actively being worked by the logged-in driver. */
export type Delivery = Order;

export interface DeliveryStartRequest {
  latitude: number;
  longitude: number;
}

export interface DeliveryStartResponse {
  isAtLocation: boolean;
  distanceMetersFromDestination: number;
}

export interface DeliveryConfirmRequest {
  deliveredQuantity: number;
  emptyCollectedQuantity: number;
  notes?: string;
}

export interface DeliveryConfirmResponse {
  deliveryId: string;
  customerOtpRequired: boolean;
}

export interface VerifyCustomerOtpRequest {
  otp: string;
}

export interface DeliverySummary {
  deliveryId: string;
  orderNumber: string;
  deliveredQuantity: number;
  emptyCollectedQuantity: number;
  completedAt: string;
}
