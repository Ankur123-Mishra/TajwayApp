import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Colors, Spacing} from '../../theme';

/**
 * Inline spinner for buttons and compact loading states.
 */
const Loader = ({size = 'small', color = Colors.primary, style}) => {
  return (
    <View style={[styles.wrap, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
});

export default Loader;
