export type ToastVariant = 'success' | 'error' | 'info';
export type ToastPosition = 'top' | 'bottom';

export interface ToastProps {
  visible: boolean;
  message: string;
  variant?: ToastVariant;
  /** Where the toast docks within its (positioned) parent. Defaults to 'bottom'. */
  position?: ToastPosition;
  /** Auto-dismiss after this many ms (calls `onDismiss`). Omit to stay until dismissed manually. */
  duration?: number;
  onDismiss?: () => void;
  testID?: string;
}
