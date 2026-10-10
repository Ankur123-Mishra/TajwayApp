import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../constants/Routes';
import OTPScreen from '../screens/auth/OTPScreen';
import PhoneLoginScreen from '../screens/auth/PhoneLoginScreen';
// import PreferencesScreen from '../screens/onboarding/PreferencesScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import SplashScreen from '../screens/onboarding/SplashScreen';
// import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
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
 * Splash → Intro → Phone → OTP → Agent tabs
 * Preferences (location + booking type) skipped after OTP
 */
const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.SPLASH}
      screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <Stack.Screen
        name={ROUTES.INTRO}
        component={OnboardingScreen}
        options={{contentStyle: {backgroundColor: '#FDF7E3'}}}
      />
      {/* Welcome (Login / Sign Up) skipped — Get Started goes straight to phone login */}
      {/* <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} /> */}
      <Stack.Screen name={ROUTES.PHONE_LOGIN} component={PhoneLoginScreen} />
      <Stack.Screen name={ROUTES.OTP} component={OTPScreen} />
      {/* Location + preferences skipped — OTP goes straight to agent tabs */}
      {/* <Stack.Screen name={ROUTES.PREFERENCES} component={PreferencesScreen} /> */}
      <Stack.Screen name={ROUTES.AGENT_ROOT} component={AgentNavigator} />
      <Stack.Screen name={ROUTES.DRIVER_ROOT} component={DriverHomeScreen} />
      <Stack.Screen name={ROUTES.OWNER_ROOT} component={OwnerHomeScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
