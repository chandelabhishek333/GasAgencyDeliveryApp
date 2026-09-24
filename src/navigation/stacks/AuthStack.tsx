import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../../screens/Auth/Splash';
import { LoginScreen } from '../../screens/Auth/Login';
import { OTPVerificationScreen } from '../../screens/Auth/OTPVerification';
import { ROUTES } from '../../constants/routes';

export type AuthStackParamList = {
  [ROUTES.SPLASH]: undefined;
  [ROUTES.LOGIN]: undefined;
  [ROUTES.OTP_VERIFICATION]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * Splash -> Login -> OTPVerification. Every screen builds its own
 * chrome (or none, for Splash/Login/OTP's full-bleed gradients), so
 * the native header is disabled throughout.
 */
export const AuthStack: React.FC = () => (
  <Stack.Navigator initialRouteName={ROUTES.SPLASH} screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
    <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    <Stack.Screen name={ROUTES.OTP_VERIFICATION} component={OTPVerificationScreen} />
  </Stack.Navigator>
);
