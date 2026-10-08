import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Colors, Spacing, Typography} from '../../theme';

/**
 * Full-screen or inline loading state.
 */
const LoadingView = ({message = 'Loading...', fullScreen = true}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default LoadingView;
