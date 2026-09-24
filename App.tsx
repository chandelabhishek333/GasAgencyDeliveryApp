// Must be the first import — required by React Navigation's native-stack.
import 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';

// Keeps the native splash (app.json's `splash` config) on screen until
// the Inter weights are loaded — without this, our JS Splash screen
// would render with the system font for a frame before snapping to
// Inter, and every custom-weight label ("MBGA", the tagline, etc.)
// would render at the platform default weight until the swap.
SplashScreen.preventAutoHideAsync().catch(() => {});

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
