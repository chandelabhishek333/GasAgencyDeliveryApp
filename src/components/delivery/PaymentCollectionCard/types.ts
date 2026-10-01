import type { DeliveryPaymentMethod, DeliveryPaymentSplit } from '../../../types';

export interface PaymentCollectionCardProps {
  /** Full amount the customer owes, in rupees. */
  payableAmount: number;
  method: DeliveryPaymentMethod;
  onMethodChange: (method: DeliveryPaymentMethod) => void;
  split: DeliveryPaymentSplit;
  onSplitChange: (split: DeliveryPaymentSplit) => void;
  /** Raw text of the partial-amount input. */
  partialAmountInput: string;
  onPartialAmountChange: (text: string) => void;
  /** Parsed partial amount when valid, else null — drives the "pending balance" helper. */
  partialAmount: number | null;
  /** Validation message for the partial amount, shown under the input. */
  partialAmountError?: string | null;
  /**
   * Amount a QR would be generated for — the full payable, or a valid
   * partial amount; null while a partial amount isn't valid yet. "Generate
   * QR" only appears for QR / UPI when this is set.
   */
  qrAmount: number | null;
  testID?: string;
}
