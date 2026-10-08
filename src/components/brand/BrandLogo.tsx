import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, Typography} from '../../theme';

/**
 * Tajway logo mark + wordmark.
 */
const BrandLogo = ({
  size = 'md',
  stacked = false,
  showDivider = true,
  style,
}) => {
  const isLg = size === 'lg';
  const isSm = size === 'sm';
  const markW = isLg ? 40 : isSm ? 26 : 34;
  const markH = isLg ? 42 : isSm ? 28 : 36;
  const brandSize = isLg ? 20 : isSm ? 13 : 16;

  return (
    <View style={[styles.row, style]}>
      <View style={[styles.mark, {width: markW, height: markH}]}>
        <View style={[styles.topBar, {width: markW * 0.9}]} />
        <View style={styles.sTop} />
        <View style={styles.sBottom} />
      </View>
      {showDivider ? (
        <View style={[styles.divider, {height: markH * 0.75}]} />
      ) : (
        <View style={{width: 8}} />
      )}
      <View style={stacked ? styles.stackedText : styles.inlineText}>
        <Text style={[styles.taj, {fontSize: brandSize}]}>Taj</Text>
        <Text
          style={[
            styles.way,
            {fontSize: brandSize},
          ]}>
          way
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mark: {
    justifyContent: 'center',
  },
  topBar: {
    height: 5,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginBottom: 2,
  },
  sTop: {
    width: '70%',
    height: 12,
    borderTopWidth: 4.5,
    borderRightWidth: 4.5,
    borderColor: Colors.primary,
    borderTopRightRadius: 12,
    alignSelf: 'flex-end',
    marginBottom: 1,
  },
  sBottom: {
    width: '70%',
    height: 12,
    borderBottomWidth: 4.5,
    borderLeftWidth: 4.5,
    borderColor: Colors.textPrimary,
    borderBottomLeftRadius: 12,
    alignSelf: 'flex-start',
  },
  divider: {
    width: 1,
    backgroundColor: Colors.borderStrong,
    marginHorizontal: 10,
  },
  inlineText: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  stackedText: {
    flexDirection: 'column',
  },
  taj: {
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primary,
  },
  way: {
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
});

export default BrandLogo;
