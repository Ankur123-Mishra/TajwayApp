import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Spacing, Typography} from '../../theme';

/**
 * Simple screen header for stack / role home screens.
 */
const ScreenHeader = ({
  title,
  subtitle,
  rightElement,
  showBorder = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {paddingTop: Math.max(insets.top, Spacing.sm) + Spacing.sm},
        showBorder && styles.border,
      ]}>
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightElement}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  textBlock: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default ScreenHeader;
