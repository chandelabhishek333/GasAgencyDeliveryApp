/**
 * @format
 */
import { AppRegistry } from 'react-native';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Must be registered at the top level, outside any React component — this
// is what lets FCM wake the app and deliver a data message while it's
// killed/backgrounded. Kept intentionally minimal: real handling (updating
// the notifications list, etc.) happens in the foreground/tap listeners in
// src/services/notificationService.ts, which only run while the JS app is
// actually mounted.
setBackgroundMessageHandler(getMessaging(), async () => {});

AppRegistry.registerComponent(appName, () => App);
