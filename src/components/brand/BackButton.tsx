import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Colors} from '../../theme';

/**
 * Circular white back button with yellow chevron — flat (no elevation).
 */
const BackButton = ({onPress, style}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Go back"
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.btn, style]}>
      <Ionicons name="chevron-back" size={24} color={Colors.primary} />
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
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default BackButton;
