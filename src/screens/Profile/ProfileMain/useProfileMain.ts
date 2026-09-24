import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProfile } from '../../../store/slices/userSlice';
import { logoutUser } from '../../../store/slices/authSlice';
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

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Prefer the freshly-fetched full profile; fall back to the lighter
  // session identity from login while it's loading.
  const driver = profile ?? sessionDriver;

  const handleLogout = async (): Promise<void> => {
    await dispatch(logoutUser());
    // authSlice resets to a logged-out state; RootNavigator swaps back
    // to AuthStack automatically — no explicit navigation call here.
  };

  return {
    driver,
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
  };
};
