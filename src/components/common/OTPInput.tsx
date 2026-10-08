import React, {useRef} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

/**
 * Multi-box OTP input. Keeps a single string value for callers.
 */
const OTPInput = ({
  length = 4,
  value = '',
  onChangeText,
  autoFocus = true,
  style,
}) => {
  const refs = useRef([]);
  const digits = Array.from({length}, (_, i) => value[i] || '');

  const updateAt = (index, char) => {
    const next = digits.slice();
    next[index] = char.replace(/\D/g, '').slice(-1);
    const joined = next.join('').slice(0, length);
    onChangeText?.(joined);
    if (char && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const onKeyPress = (index, key) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={[styles.row, style]}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={el => {
            refs.current[index] = el;
          }}
          style={styles.box}
          value={digit}
          onChangeText={text => updateAt(index, text)}
          onKeyPress={({nativeEvent}) => onKeyPress(index, nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={autoFocus && index === 0}
          selectTextOnFocus
          textAlign="center"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  box: {
    flex: 1,
    height: Dimensions.inputHeight + 4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Dimensions.borderRadius.md,
    backgroundColor: Colors.surface,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
});

export default OTPInput;
