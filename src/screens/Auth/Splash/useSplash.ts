import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { bootstrapAuth } from '../../../store/slices/authSlice';
import { selectIsAuthBootstrapped, selectIsAuthenticated } from '../../../store/selectors/authSelectors';
import { ROUTES } from '../../../constants/routes';
import type { SplashScreenProps } from './types';

/** Minimum time the branded splash stays up before handing off, so it
 * reads as a real splash rather than a flash of content. */
const MIN_SPLASH_MS = 2600;

/**
 * Splash kicks off the AsyncStorage session bootstrap and waits (with a
 * ~2.6s minimum branded-splash duration). If it resolves authenticated,
 * RootNavigator swaps the whole stack to MainTabNavigator on its own —
 * this screen does nothing further. If it resolves unauthenticated,
 * Splash auto-navigates to Login once both the bootstrap and the
 * minimum duration have finished.
 */
export const useSplash = (navigation: SplashScreenProps['navigation']): void => {
  const dispatch = useAppDispatch();
  const isBootstrapped = useAppSelector(selectIsAuthBootstrapped);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [minDurationElapsed, setMinDurationElapsed] = useState(false);

  useEffect(() => {
    dispatch(bootstrapAuth());
    const timer = setTimeout(() => setMinDurationElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (isBootstrapped && minDurationElapsed && !isAuthenticated) {
      navigation.replace(ROUTES.LOGIN);
    }
  }, [isBootstrapped, minDurationElapsed, isAuthenticated, navigation]);
};
