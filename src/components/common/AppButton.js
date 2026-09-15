/**
 * TaxiConnect brand buttons — updated for Taxi Sanchalak yellow theme.
 */
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

const VARIANT_STYLES = {
  primary: {
    backgroundColor: Colors.primary,
    textColor: Colors.textInverse,
    borderColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
    textColor: Colors.textInverse,
    borderColor: Colors.secondary,
  },
  outline: {
    backgroundColor: Colors.transparent,
    textColor: Colors.primary,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: Colors.transparent,
    textColor: Colors.primary,
    borderColor: Colors.transparent,
  },
  danger: {
    backgroundColor: Colors.error,
    textColor: Colors.textInverse,
    borderColor: Colors.error,
  },
};

const AppButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  textStyle,
}) => {
  const palette = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const height =
    Dimensions.buttonHeight[size] || Dimensions.buttonHeight.md;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
          height,
          opacity: disabled || loading ? 0.55 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={palette.textColor} />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.label, {color: palette.textColor}, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Dimensions.borderRadius.md,
    borderWidth: 0,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    ...Typography.button,
    fontWeight: Typography.fontWeights.bold,
  },
});

export default AppButton;
