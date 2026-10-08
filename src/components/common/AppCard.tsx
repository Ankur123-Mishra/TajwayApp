import React from 'react';
import {Text, View} from 'react-native';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

/**
 * Elevated surface card used across marketplace lists and dashboards.
 */
const AppCard = ({children, style, padded = true}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={[styles.card, padded && styles.padded, style]}>{children}</View>
  );
};

export const CardTitle = ({children, style}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
  <Text style={[styles.title, style]}>{children}</Text>
);
};

export const CardSubtitle = ({children, style}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
  <Text style={[styles.subtitle, style]}>{children}</Text>
);
};

const baseStyles = {
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
};

export default AppCard;
