import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

/**
 * Country code + phone input row matching login / OTP screens.
 */
const PhoneInputRow = ({
  value,
  onChangeText,
  editable = true,
  placeholder = 'Enter your phone number',
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.codeBox}>
        <Text style={styles.flag}>🇮🇳</Text>
        <Text style={styles.code}>+91</Text>
      </View>
      <View style={[styles.phoneBox, !editable && styles.phoneBoxReadonly]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType="phone-pad"
          maxLength={10}
          placeholder={placeholder}
          placeholderTextColor={Colors.textPlaceholder}
          style={styles.input}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.md,
    paddingHorizontal: 12,
    height: 54,
    ...Dimensions.shadow.soft,
  },
  flag: {
    fontSize: 16,
    marginRight: 6,
  },
  code: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
  },
  phoneBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.md,
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
    ...Dimensions.shadow.soft,
  },
  phoneBoxReadonly: {
    opacity: 1,
  },
  input: {
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
});

export default PhoneInputRow;
