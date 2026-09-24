import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { resendOtp, verifyOtp } from '../../../store/slices/authSlice';
import { selectAuthError, selectAuthStatus, selectPendingOtp } from '../../../store/selectors/authSelectors';

const OTP_LENGTH = 4;
// Only used if this screen is somehow reached without a pendingOtp
// (shouldn't normally happen — Login always sets one first).
const DEFAULT_RESEND_SECONDS = 30;

/**
 * Reads the phone number from `authSlice.pendingOtp` (set by Login's
 * loginWithPhone) rather than a navigation param — a single source of
 * truth, and one less thing for the navigation layer to wire. The
 * countdown seeds from the backend's own `resend_after` (via
 * `pendingOtp.resendAfterSeconds`) rather than a hardcoded value, so a
 * cooldown change on the backend is reflected automatically. The
 * arrival toast is seeded once from `pendingOtp.message` (captured at
 * mount, i.e. right after Login's request/resend) and refreshed with
 * each successful resend.
 */
export const useOTPVerification = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const pendingOtp = useAppSelector(selectPendingOtp);
  const [otp, setOtp] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(
    () => pendingOtp?.resendAfterSeconds ?? DEFAULT_RESEND_SECONDS,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(() => pendingOtp?.message ?? null);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return undefined;
    }
    const timer = setInterval(() => setSecondsRemaining((seconds) => seconds - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

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
    } catch {
      // authSlice.error already reflects the failure.
    }
  };

  const handleResend = async (): Promise<void> => {
    if (secondsRemaining > 0 || !pendingOtp) {
      return;
    }
    try {
      const result = await dispatch(resendOtp()).unwrap();
      setSecondsRemaining(result.resendAfterSeconds);
      setSuccessMessage(result.message);
    } catch {
      // Leave the timer at 0 so the driver can just tap Resend again.
    }
  };

  const handleDismissSuccess = (): void => {
    setSuccessMessage(null);
  };

  return {
    otp,
    setOtp,
    isComplete,
    isLoading,
    error,
    secondsRemaining,
    successMessage,
    phone: pendingOtp?.phone ?? '',
    handleVerify,
    handleResend,
    handleDismissSuccess,
  };
};
