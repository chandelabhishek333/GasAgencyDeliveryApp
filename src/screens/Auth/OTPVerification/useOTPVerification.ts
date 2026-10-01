import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { clearAuthError, resendOtp, verifyOtp } from '../../../store/slices/authSlice';
import { selectAuthStatus, selectPendingOtp } from '../../../store/selectors/authSelectors';

const OTP_LENGTH = 4;
// Only used if this screen is somehow reached without a pendingOtp
// (shouldn't normally happen — Login always sets one first).
const DEFAULT_RESEND_SECONDS = 30;

export interface OTPToast {
  message: string;
  variant: 'success' | 'error';
}

/**
 * Reads the phone number from `authSlice.pendingOtp` (set by Login's
 * loginWithPhone) rather than a navigation param — a single source of
 * truth, and one less thing for the navigation layer to wire. The
 * countdown seeds from the backend's own `resend_after` (via
 * `pendingOtp.resendAfterSeconds`) rather than a hardcoded value, so a
 * cooldown change on the backend is reflected automatically. The
 * arrival toast is seeded once from `pendingOtp.message` (captured at
 * mount, i.e. right after Login's request/resend) and refreshed with
 * each successful resend. Verify/resend failures go to the same toast
 * (as an error) instead of inline text; `hasError` keeps the OTP boxes'
 * red outline until the driver edits the code.
 */
export const useOTPVerification = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const pendingOtp = useAppSelector(selectPendingOtp);
  const [otp, setOtpValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(
    () => pendingOtp?.resendAfterSeconds ?? DEFAULT_RESEND_SECONDS,
  );
  const [toast, setToast] = useState<OTPToast | null>(() =>
    pendingOtp?.message ? { message: pendingOtp.message, variant: 'success' } : null,
  );

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return undefined;
    }
    const timer = setInterval(() => setSecondsRemaining((seconds) => seconds - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const setOtp = useCallback((value: string): void => {
    setOtpValue(value);
    setHasError(false);
  }, []);

  const isComplete = otp.length === OTP_LENGTH;
  const isLoading = status === 'loading';

  const handleVerify = async (): Promise<void> => {
    if (!isComplete || !pendingOtp) {
      return;
    }
    try {
      await dispatch(verifyOtp({ phone: pendingOtp.phone, otp })).unwrap();
      // isAuthenticated flips true in the store on success; RootNavigator
      // swaps AuthStack -> MainTabNavigator. No navigation call here.
    } catch (error) {
      setHasError(true);
      setToast({ message: typeof error === 'string' ? error : 'Invalid OTP.', variant: 'error' });
      // Shown via the toast instead — don't leave it lingering in the
      // store for Login to pick up if the driver navigates back.
      dispatch(clearAuthError());
    }
  };

  const handleResend = async (): Promise<void> => {
    if (secondsRemaining > 0 || !pendingOtp) {
      return;
    }
    try {
      const result = await dispatch(resendOtp()).unwrap();
      setSecondsRemaining(result.resendAfterSeconds);
      setOtpValue('');
      setHasError(false);
      setToast({ message: result.message, variant: 'success' });
    } catch (error) {
      // Leave the timer at 0 so the driver can just tap Resend again.
      setToast({ message: typeof error === 'string' ? error : 'Failed to resend OTP.', variant: 'error' });
    }
  };

  const handleDismissToast = useCallback((): void => {
    setToast(null);
  }, []);

  return {
    otp,
    setOtp,
    isComplete,
    isLoading,
    hasError,
    secondsRemaining,
    toast,
    phone: pendingOtp?.phone ?? '',
    handleVerify,
    handleResend,
    handleDismissToast,
  };
};
