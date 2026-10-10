import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Colors} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

/**
 * Circular white back button with yellow chevron — flat (no elevation).
 */
const BackButton = ({onPress, style, color = Colors.primary}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Go back"
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.btn, style]}>
      <Ionicons name="chevron-back" size={24} color={color} />
    </TouchableOpacity>
  );
};

const baseStyles = {
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
};

export default BackButton;
