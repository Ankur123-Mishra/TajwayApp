import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

/**
 * Labeled text input with consistent marketplace styling.
 */
const AppTextInput = ({
  label,
  error,
  containerStyle,
  style,
  ...inputProps
}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={Colors.textMuted}
        style={[styles.input, error && styles.inputError, style]}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const baseStyles = {
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  input: {
    height: Dimensions.inputHeight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Dimensions.borderRadius.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    ...Typography.body,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
};

export default AppTextInput;
