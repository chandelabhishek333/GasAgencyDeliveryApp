import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProfile } from '../../../store/slices/userSlice';
import { logoutAll, logoutUser } from '../../../store/slices/authSlice';
import { selectProfile, selectProfileStatus } from '../../../store/selectors/userSelectors';
import { selectAccountStatus, selectDriver } from '../../../store/selectors/authSelectors';
import { getInitials } from '../../../utils/getInitials';
import { ROUTES } from '../../../constants/routes';
import type { ProfileMainScreenProps } from './types';

// Trailing chars of the backend id, cosmetically dressed up as a
// driver badge id — there's no separate `driverId` field on `Driver`.
const formatDriverId = (id: string): string => `DRV-${id.slice(-4).toUpperCase()}`;

export const useProfileMain = (navigation: ProfileMainScreenProps['navigation']) => {
  const dispatch = useAppDispatch();
  const sessionDriver = useAppSelector(selectDriver);
  const profile = useAppSelector(selectProfile);
  const status = useAppSelector(selectProfileStatus);
  const accountStatus = useAppSelector(selectAccountStatus);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  // Refetched on every focus, so today's shift stats are current after a delivery.
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );

  // GET /driver/profile carries both the driver info and today's shiftStats.
  const { refreshing, handleRefresh } = usePullToRefresh(useCallback(() => [dispatch(fetchProfile())], [dispatch]));

  // Prefer the freshly-fetched full profile; fall back to the lighter
  // session identity from login while it's loading.
  const driver = profile ?? sessionDriver;

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
    isVerified: accountStatus === 'ACTIVE',
    driverIdLabel: driver ? formatDriverId(driver.id) : '',
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
