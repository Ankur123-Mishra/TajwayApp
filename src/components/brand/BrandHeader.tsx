import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {APP_TAGLINE} from '../../constants/AppConstants';
import {Colors, Spacing, Typography} from '../../theme';
import BrandLogo from './BrandLogo';

/**
 * Logo + tagline block used on Welcome / Phone / OTP screens.
 */
const BrandHeader = ({
  tagline = APP_TAGLINE,
  highlight = 'B2B',
  size = 'md',
  style,
}) => {
  const parts = tagline.split(highlight);

  return (
    <View style={[styles.wrap, style]}>
      <BrandLogo size={size} />
      <View style={styles.line} />
      <Text style={styles.tagline}>
        {parts[0]}
        <Text style={styles.highlight}>{highlight}</Text>
        {parts[1] || ''}
      </Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  line: {
    alignSelf: 'stretch',
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderStrong,
    marginVertical: Spacing.sm,
  },
  tagline: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  highlight: {
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold,
  },
});

export default BrandHeader;
