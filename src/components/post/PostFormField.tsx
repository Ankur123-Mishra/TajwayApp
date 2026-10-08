import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Colors, Spacing} from '../../theme';

/**
 * Labeled form row matching Post Booking / Free Vehicle screenshots.
 */
const PostFormField = ({
  label,
  value,
  placeholder,
  onPress,
  icon,
  multiline = false,
  rightElement,
}) => {
  const display = value || placeholder;
  const isPlaceholder = !value;

  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        activeOpacity={onPress ? 0.75 : 1}
        onPress={onPress}
        disabled={!onPress}
        style={[styles.inputWrap, multiline && styles.inputWrapMulti]}>
        <Text
          style={[styles.value, isPlaceholder && styles.placeholder]}
          numberOfLines={multiline ? 4 : 1}>
          {display}
        </Text>
        {rightElement ||
          (icon ? (
            <Ionicons name={icon} size={20} color={Colors.primary} />
          ) : null)}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSlate,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  inputWrapMulti: {
    minHeight: 100,
    alignItems: 'flex-start',
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  placeholder: {
    color: Colors.textPlaceholder,
  },
});

export default PostFormField;
