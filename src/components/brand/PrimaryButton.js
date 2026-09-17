import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

/**
 * Tajway primary CTA — yellow, rounded, white label by default.
 */
const PrimaryButton = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  showArrow = false,
  darkText = false,
  style,
  textStyle,
}) => {
  const isSecondary = variant === 'secondary';
  const bg = isSecondary ? Colors.secondary : Colors.primary;
  const color = darkText ? Colors.textPrimary : Colors.textInverse;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          opacity: disabled || loading ? 0.55 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.label, {color}, textStyle]}>{title}</Text>
          {showArrow ? <Text style={[styles.arrow, {color}]}>→</Text> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: Dimensions.borderRadius.md,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Dimensions.shadow.soft,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
  },
  arrow: {
    position: 'absolute',
    right: 4,
    fontSize: 20,
    fontWeight: '700',
  },
});

export default PrimaryButton;
