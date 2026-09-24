export interface PaymentMethod {
  id: string;
  type: string;
  label: string;
  isDefault: boolean;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}
