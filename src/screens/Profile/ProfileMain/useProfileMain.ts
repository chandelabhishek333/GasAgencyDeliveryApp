import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProfile } from '../../../store/slices/userSlice';
import { logoutAll, logoutUser } from '../../../store/slices/authSlice';
import { selectProfile, selectProfileStatus } from '../../../store/selectors/userSelectors';
import { selectDriver } from '../../../store/selectors/authSelectors';
import { getInitials } from '../../../utils/getInitials';
import { ROUTES } from '../../../constants/routes';
import type { Driver } from '../../../types';
import type { ProfileMainScreenProps } from './types';

export const useProfileMain = (navigation: ProfileMainScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const sessionDriver = useAppSelector(selectDriver);
  const profile = useAppSelector(selectProfile);
  const status = useAppSelector(selectProfileStatus);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  // Refetched on every focus, so today's shift stats are current after a delivery.
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );

  // GET /driver/profile carries both the driver info and today's shiftStats.
  const { refreshing, handleRefresh } = usePullToRefresh(useCallback(() => [dispatch(fetchProfile())], [dispatch]));

  // The fresh GET /driver/profile wins field by field; employeeCode and
  // approvalStatus only come from the session's GET /auth/me, so they're kept.
  const latest = profile ?? sessionDriver;
  const driver: Driver | null = latest
    ? {
        ...sessionDriver,
        ...latest,
        employeeCode: profile?.employeeCode || sessionDriver?.employeeCode,
        approvalStatus: profile?.approvalStatus || sessionDriver?.approvalStatus,
      }
    : null;

  const handleLogout = async (): Promise<void> => {
    await dispatch(logoutUser());
    // authSlice resets to a logged-out state; RootNavigator swaps back
    // to AuthStack automatically — no explicit navigation call here.
  };

  const confirmLogoutAll = async (): Promise<void> => {
    setIsLoggingOutAll(true);
    try {
      await dispatch(logoutAll()).unwrap();
      // Every slice resets (see store/index.ts) and RootNavigator swaps
      // back to AuthStack, unmounting this screen — nothing more to do.
    } catch (error) {
      setIsLoggingOutAll(false);
      Alert.alert('Sign out failed', typeof error === 'string' ? error : 'Please try again.');
    }
  };

  const handleLogoutAll = (): void => {
    Alert.alert('Sign Out of All Devices', 'Are you sure you want to sign out from all devices?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: confirmLogoutAll },
    ]);
  };

  return {
    refreshing,
    handleRefresh,
    driver,
    /** Today's totals from GET /driver/profile — null until it loads (cards show "—"). */
    shiftStats: profile?.shiftStats ?? null,
    initials: driver ? driver.avatarInitials ?? getInitials(driver.name) : '',
    isLoading: status === 'loading' && !driver,
    isVerified: driver?.approvalStatus === 'APPROVED',
    employeeCode: driver?.employeeCode || '',
    handleBack: () => navigation.goBack(),
    // TODO: EditProfile screen isn't built/registered in ProfileStack yet.
    handleEditAvatar: () => {},
    handleMyDeliveries: () => navigation.navigate(ROUTES.ORDER_LIST),
    // Not in the original 3-item menu spec — added since OrderHistoryScreen
    // (built in an earlier group, registered in ProfileStack) was
    // otherwise unreachable from anywhere in the app.
    handleDeliveryHistory: () => navigation.navigate(ROUTES.ORDER_HISTORY),
    handleHelpSupport: () => navigation.navigate(ROUTES.SUPPORT),
    handleLogout,
    handleLogoutAll,
    isLoggingOutAll,
  };
};
