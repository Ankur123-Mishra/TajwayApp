import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

/**
 * Horizontal step progress for multi-step forms.
 * @param {string[]} steps
 * @param {number} current zero-based index
 */
const StepIndicator = ({steps = [], current = 0}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {steps.map((label, index) => {
        const active = index === current;
        const done = index < current;
        return (
          <View key={`${label}-${index}`} style={styles.item}>
            <View
              style={[
                styles.dot,
                (active || done) && styles.dotOn,
                done && styles.dotDone,
              ]}>
              <Text
                style={[
                  styles.dotText,
                  (active || done) && styles.dotTextOn,
                ]}>
                {done ? '✓' : index + 1}
              </Text>
            </View>
            <Text
              style={[styles.label, active && styles.labelOn]}
              numberOfLines={1}>
              {label}
            </Text>
            {index < steps.length - 1 ? (
              <View style={[styles.line, done && styles.lineOn]} />
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.xs,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dotDone: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  dotText: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textMuted,
  },
  dotTextOn: {
    color: Colors.onPrimary,
  },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginLeft: Spacing.xs,
    maxWidth: 72,
  },
  labelOn: {
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeights.semibold,
  },
  line: {
    width: 18,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
    borderRadius: 1,
  },
  lineOn: {
    backgroundColor: Colors.success,
  },
});

export default StepIndicator;
