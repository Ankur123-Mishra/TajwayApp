import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

/**
 * Elevated surface card used across marketplace lists and dashboards.
 */
const AppCard = ({children, style, padded = true}) => {
  return (
    <View style={[styles.card, padded && styles.padded, style]}>{children}</View>
  );
};

export const CardTitle = ({children, style}) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

export const CardSubtitle = ({children, style}) => (
  <Text style={[styles.subtitle, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Dimensions.shadow.soft,
  },
  padded: {
    padding: Spacing.cardPadding,
  },
  title: {
    ...Typography.h4,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});

export default AppCard;
