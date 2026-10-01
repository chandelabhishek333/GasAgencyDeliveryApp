// Must be the first import — required by React Navigation's native-stack.
import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';

// Inter is statically linked as a native asset (src/assets/fonts, see
// react-native.config.js) instead of loaded at runtime — the font is
// available from the first frame, so there's no fontsLoaded gate or
// splash hand-off needed here anymore.
const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
