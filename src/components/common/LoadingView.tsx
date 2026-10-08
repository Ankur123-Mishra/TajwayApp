import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {Colors, Spacing, Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

/**
 * Full-screen or inline loading state.
 */
const LoadingView = ({message = 'Loading...', fullScreen = true}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const baseStyles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  message: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
};

export default LoadingView;
