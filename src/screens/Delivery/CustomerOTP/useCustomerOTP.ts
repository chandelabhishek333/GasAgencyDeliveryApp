import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { verifyActiveDeliveryOtp } from '../../../store/slices/deliverySlice';
import {
  selectActiveDelivery,
  selectDeliveryActionStatus,
  selectDeliveryError,
} from '../../../store/selectors/deliverySelectors';
import { ROUTES } from '../../../constants/routes';
import type { CustomerOTPScreenProps } from './types';

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;

export const useCustomerOTP = (navigation: CustomerOTPScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const activeDelivery = useAppSelector(selectActiveDelivery);
  const actionStatus = useAppSelector(selectDeliveryActionStatus);
  const error = useAppSelector(selectDeliveryError);
  const [otp, setOtp] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return undefined;
    }
    const timer = setInterval(() => setSecondsRemaining((seconds) => seconds - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const isComplete = otp.length === OTP_LENGTH;
  const isLoading = actionStatus === 'loading';

  const handleVerify = async (): Promise<void> => {
    if (!isComplete || !activeDelivery) {
      return;
    }
    try {
      await dispatch(
        verifyActiveDeliveryOtp({ deliveryId: activeDelivery.id, payload: { otp } }),
      ).unwrap();
      navigation.navigate(ROUTES.DELIVERY_COMPLETE);
    } catch {
      // deliverySlice.error already reflects the failure.
    }
  };

  const handleResend = (): void => {
    if (secondsRemaining > 0) {
      return;
    }
    setSecondsRemaining(RESEND_SECONDS);
    // TODO: confirm endpoint — resending the customer OTP isn't in the
    // original service spec.
  };

  const handleCallCustomer = (): void => {
    if (activeDelivery) {
      Linking.openURL(`tel:${activeDelivery.customerPhone}`);
    }
  };

  return {
    activeDelivery,
    otp,
    setOtp,
    isComplete,
    isLoading,
    error,
    secondsRemaining,
    handleVerify,
    handleResend,
    handleCallCustomer,
    handleBack: () => navigation.goBack(),
  };
};
