import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStack } from './stacks/AuthStack';
import { MainTabNavigator } from './tabs/MainTabNavigator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectIsAuthenticated } from '../store/selectors/authSelectors';
import { fetchNotifications } from '../store/slices/notificationsSlice';
import {
  addNotificationListeners,
  registerForPushNotificationsAsync,
  removeNotificationListeners,
} from '../services/notificationService';

/**
 * Auth vs. app, gated on `isAuthenticated`. Deliberately does NOT
 * dispatch bootstrapAuth or show its own loader here — Splash (the
 * first screen inside AuthStack) already owns that: it dispatches the
 * AsyncStorage session check itself and shows its own branded UI
 * while waiting, then either replaces itself with Login (staying
 * inside AuthStack) or — once `isAuthenticated` flips true here —
 * this component swaps the whole tree to MainTabNavigator, unmounting
 * AuthStack (and Splash) automatically. See useSplash.ts.
 *
 * Also owns push-notification setup for the app's whole lifetime: it
 * requests permission + fetches/persists the real FCM token on launch
 * (regardless of auth state, since it's needed for the OTP request
 * itself — see getDeviceInfo), and re-fetches the server-backed
 * notifications list (Screen 13) whenever a push arrives in the
 * foreground or the user taps one, rather than constructing a local
 * notification object that could drift from the API's shape.
 */
export const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    registerForPushNotificationsAsync().catch(() => {});

    addNotificationListeners({
      onForegroundNotification: () => {
        dispatch(fetchNotifications());
      },
      onNotificationTap: () => {
        dispatch(fetchNotifications());
      },
    });

    return () => {
      removeNotificationListeners();
    };
  }, [dispatch]);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};
