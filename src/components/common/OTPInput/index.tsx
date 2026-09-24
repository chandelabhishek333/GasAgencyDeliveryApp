import React, { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import type { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { Colors } from '../../../theme';
import { styles } from './styles';
import type { OTPInputProps } from './types';

/**
 * Fixed-length OTP entry: one box per digit, auto-advances focus on
 * input and steps back on backspace into an empty box. A box is
 * "active" (tinted `accentColor`) once it holds a digit or has focus;
 * otherwise it shows the inactive slate style.
 */
export const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  value,
  onChangeText,
  error = false,
  autoFocus = false,
  boxHeight = 56,
  accentColor = Colors.secondary,
  testID,
}) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChangeText = (text: string, index: number): void => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const characters = value.split('');
    characters[index] = digit;
    const nextValue = characters.join('').slice(0, length);
    onChangeText(nextValue);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ): void => {
    if (event.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row} testID={testID}>
      {Array.from({ length }).map((_, index) => {
        const digit = value[index] ?? '';
        const isFilled = digit.length > 0;
        const isActive = isFilled || focusedIndex === index;
        const stateStyle = error
          ? styles.error
          : isActive
            ? [styles.active, { borderColor: accentColor, color: accentColor, shadowColor: accentColor }]
            : styles.inactive;

        return (
          <TextInput
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            ref={(inputRef) => {
              inputRefs.current[index] = inputRef;
            }}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex((prev) => (prev === index ? null : prev))}
            keyboardType="number-pad"
            maxLength={1}
            autoFocus={autoFocus && index === 0}
            style={[styles.box, { height: boxHeight }, stateStyle]}
          />
        );
      })}
    </View>
  );
};
