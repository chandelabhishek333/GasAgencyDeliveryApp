export interface OTPInputProps {
  /** Number of digit boxes. Defaults to 4 — every OTP screen in the spec uses 4. */
  length?: number;
  /** The OTP typed so far, as a single string (e.g. "12"). Parent-controlled. */
  value: string;
  onChangeText: (value: string) => void;
  /** Shows the error border treatment (e.g. after a rejected OTP). */
  error?: boolean;
  autoFocus?: boolean;
  /** Box height override. Defaults to 56. */
  boxHeight?: number;
  /** Border/text tint for a filled or focused box. Defaults to the brand orange. */
  accentColor?: string;
  testID?: string;
}
