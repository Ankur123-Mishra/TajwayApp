import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../constants/Routes';
import OTPScreen from '../screens/auth/OTPScreen';
import PhoneLoginScreen from '../screens/auth/PhoneLoginScreen';
import PreferencesScreen from '../screens/onboarding/PreferencesScreen';
import SplashScreen from '../screens/onboarding/SplashScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import OwnerHomeScreen from '../screens/owner/OwnerHomeScreen';
import {Colors} from '../theme';
import AgentNavigator from './AgentNavigator';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  contentStyle: {backgroundColor: Colors.background},
  animation: 'slide_from_right',
};

/**
 * Root flow:
 * Splash → Welcome → Phone → OTP → Preferences → Agent tabs
 */
const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.SPLASH}
      screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
      <Stack.Screen name={ROUTES.PHONE_LOGIN} component={PhoneLoginScreen} />
      <Stack.Screen name={ROUTES.OTP} component={OTPScreen} />
      <Stack.Screen name={ROUTES.PREFERENCES} component={PreferencesScreen} />
      <Stack.Screen name={ROUTES.AGENT_ROOT} component={AgentNavigator} />
      <Stack.Screen name={ROUTES.DRIVER_ROOT} component={DriverHomeScreen} />
      <Stack.Screen name={ROUTES.OWNER_ROOT} component={OwnerHomeScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
