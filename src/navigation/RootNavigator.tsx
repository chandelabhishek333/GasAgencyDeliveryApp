import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import type { RemoteMessage } from '@react-native-firebase/messaging';
import { AuthStack } from './stacks/AuthStack';
import { MainTabNavigator } from './tabs/MainTabNavigator';
import { Toast } from '../components/common/Toast';
import { syncFcmTokenWithServer } from '../api/interceptors/errorInterceptor';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectIsAuthenticated } from '../store/selectors/authSelectors';
import { fetchNotifications } from '../store/slices/notificationsSlice';
import {
  addNotificationListeners,
  registerForPushNotificationsAsync,
  removeNotificationListeners,
} from '../services/notificationService';

const PUSH_BANNER_DURATION_MS = 5000;

/**
 * Title + body of a push, one per line. Reads the `notification` block
 * first and falls back to `data.title`/`data.body` for data-only sends.
 * Null when neither carries any text — nothing worth a banner.
 */
const getPushBannerText = (message: RemoteMessage): string | null => {
  const title = message.notification?.title ?? message.data?.title;
  const body = message.notification?.body ?? message.data?.body;
  const text = [title, body].filter((part): part is string => typeof part === 'string' && part.length > 0).join('\n');
  return text || null;
};

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
 * fetches/persists the real FCM token (independent of permission) and
 * requests notification permission on launch
 * (regardless of auth state, since it's needed for the OTP request
 * itself — see getDeviceInfo), and re-fetches the server-backed
 * notifications list (Screen 13) whenever a push arrives in the
 * foreground or the user taps one, rather than constructing a local
 * notification object that could drift from the API's shape.
 *
 * Android never puts a push in the tray while the app is open, so a
 * foreground push is shown as a top Toast banner instead. A rotated
 * FCM token — seen live via onTokenRefresh, or found on launch after
 * rotating while the app was closed — is reported to the server via
 * syncFcmTokenWithServer, or pushes would keep going to the dead one.
 */
export const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [pushBanner, setPushBanner] = useState<string | null>(null);

  const handleDismissPushBanner = useCallback(() => setPushBanner(null), []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(() => syncFcmTokenWithServer())
      .catch(() => {});

    addNotificationListeners({
      onTokenRefresh: () => {
        syncFcmTokenWithServer().catch(() => {});
      },
      onForegroundNotification: (message) => {
        const bannerText = getPushBannerText(message);
        if (bannerText) {
          setPushBanner(bannerText);
        }
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
    <>
      <NavigationContainer>
        {isAuthenticated ? <MainTabNavigator /> : <AuthStack />}
      </NavigationContainer>
      <Toast
        visible={Boolean(pushBanner)}
        message={pushBanner ?? ''}
        variant="info"
        position="top"
        duration={PUSH_BANNER_DURATION_MS}
        onDismiss={handleDismissPushBanner}
      />
    </>
  );
};
