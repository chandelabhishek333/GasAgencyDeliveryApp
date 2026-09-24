export interface LoaderProps {
  size?: 'small' | 'large';
  /** Optional caption shown below the spinner (e.g. "Loading orders..."). */
  label?: string;
  /** Renders as an absolute-fill overlay on top of existing content. */
  fullScreen?: boolean;
  testID?: string;
}
