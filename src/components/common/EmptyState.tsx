import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';
import AppButton from './AppButton';

/**
 * Empty / placeholder state for lists and unfinished modules.
 */
const EmptyState = ({
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBubble}>
        <Text style={styles.iconText}>TW</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton
          title={actionLabel}
          onPress={onAction}
          style={styles.button}
          fullWidth={false}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: Dimensions.borderRadius.xl,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  iconText: {
    ...Typography.h3,
    color: Colors.primary,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    maxWidth: 280,
  },
  button: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
});

export default EmptyState;
