import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {Colors} from '../theme';
import RootNavigator from './RootNavigator';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.textPrimary,
    border: Colors.border,
    notification: Colors.primary,
  },
};

const AppNavigator = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
