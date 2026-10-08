import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Colors, Spacing} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

/**
 * Inline spinner for buttons and compact loading states.
 */
const Loader = ({size = 'small', color = Colors.primary, style}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={[styles.wrap, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const baseStyles = {
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
};

export default Loader;
