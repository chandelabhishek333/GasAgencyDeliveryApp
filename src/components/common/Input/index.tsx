import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Colors } from '../../../theme';
import { styles } from './styles';
import type { InputProps } from './types';

/**
 * Generic labeled text field with left/right icon slots, error/helper
 * text, and an orange focus border matching the design system's
 * active-field treatment (see Duty Login's phone field).
 */
export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines,
  editable = true,
  maxLength,
  onFocus,
  onBlur,
  containerStyle,
  inputStyle,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  const handleFocus = (): void => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = (): void => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.fieldRow,
          isFocused && !hasError && styles.fieldFocused,
          hasError && styles.fieldError,
          !editable && styles.fieldDisabled,
        ]}
      >
        {leftIcon ? (
          <Pressable onPress={onLeftIconPress} disabled={!onLeftIconPress} hitSlop={8}>
            {leftIcon}
          </Pressable>
        ) : null}

        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textPlaceholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, multiline && styles.multilineInput, inputStyle]}
        />

        {rightIcon ? (
          <Pressable onPress={onRightIconPress} disabled={!onRightIconPress} hitSlop={8}>
            {rightIcon}
          </Pressable>
        ) : null}
      </View>

      {hasError ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};
