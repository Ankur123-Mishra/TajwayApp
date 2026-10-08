import React, {useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import {useResponsiveStyles} from '../../hooks';

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
  const styles = useResponsiveStyles(baseStyles);
  const refs = useRef([]);
  const [focused, setFocused] = useState(autoFocus ? 0 : -1);
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
          style={[styles.box, focused === index && styles.boxFocused]}
          value={digit}
          onChangeText={text => updateAt(index, text)}
          onKeyPress={({nativeEvent}) => onKeyPress(index, nativeEvent.key)}
          onFocus={() => setFocused(index)}
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={autoFocus && index === 0}
          selectTextOnFocus
          textAlign="center"
          selectionColor="#E98A82"
          cursorColor="#2C2C2C"
        />
      ))}
    </View>
  );
};

const baseStyles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
  box: {
    width: 56,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#E6E6E6',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  boxFocused: {
    borderColor: '#F0A095',
  },
};

export default OTPInput;
