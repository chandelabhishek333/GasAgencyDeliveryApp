import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { clearAuthError, loginWithPhone } from '../../../store/slices/authSlice';
import { selectAuthError, selectAuthStatus } from '../../../store/selectors/authSelectors';
import { consumePendingAuthToast } from '../../../utils/pendingAuthToast';
import { ROUTES } from '../../../constants/routes';
import type { LoginScreenProps } from './types';

export const PHONE_LENGTH = 10;

export const useLogin = (navigation: LoginScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const [phone, setPhone] = useState('');
  // Read once on mount (state initializer, not an effect) — a logout
  // just before landing here leaves this set; any other arrival leaves
  // it null. Consuming it immediately means a re-render never re-shows it.
  const [logoutMessage, setLogoutMessage] = useState<string | null>(() => consumePendingAuthToast());

  const isValidPhone = phone.length === PHONE_LENGTH;
  const isLoading = status === 'loading';

  const handleChangePhone = (text: string): void => {
    if (error) {
      dispatch(clearAuthError());
    }
    setPhone(text.replace(/[^0-9]/g, '').slice(0, PHONE_LENGTH));
  };

  // Navigates immediately on success — the backend's success copy and
  // resend cooldown travel via `pendingOtp` and are shown as
  // OTPVerification's own arrival toast/countdown instead.
  const handleSendOtp = async (): Promise<void> => {
    if (!isValidPhone) {
      return;
    }
    try {
      await dispatch(loginWithPhone({ phone })).unwrap();
      navigation.navigate(ROUTES.OTP_VERIFICATION);
    } catch {
      // authSlice.error already reflects the failure — surfaced via the error toast.
    }
  };

  const handleDismissError = (): void => {
    dispatch(clearAuthError());
  };

  const handleDismissLogoutMessage = (): void => {
    setLogoutMessage(null);
  };

  return {
    phone,
    isValidPhone,
    isLoading,
    error,
    logoutMessage,
    handleChangePhone,
    handleSendOtp,
    handleDismissError,
    handleDismissLogoutMessage,
  };
};
