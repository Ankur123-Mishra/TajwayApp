/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    GestureHandlerRootView: ({children, style}) =>
      React.createElement(View, {style}, children),
  };
});

jest.mock('react-redux', () => ({
  Provider: ({children}) => children,
}));

jest.mock('../src/redux/store', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('../src/navigation/AppNavigator', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(Text, null, 'Tajway'),
  };
});

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
