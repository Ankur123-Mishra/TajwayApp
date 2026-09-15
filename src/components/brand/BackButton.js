import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Colors, Dimensions} from '../../theme';

/**
 * Circular white back button with yellow chevron (screenshot style).
 */
const BackButton = ({onPress, style}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Go back"
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.btn, style]}>
      <Text style={styles.chevron}>‹</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Dimensions.shadow.soft,
  },
  chevron: {
    fontSize: 28,
    lineHeight: 30,
    color: Colors.primary,
    fontWeight: '300',
    marginTop: -2,
    marginLeft: -1,
  },
});

export default BackButton;
