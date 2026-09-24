import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import type { HeaderProps } from './types';

/**
 * Shared "← Title [right action]" nav header used by every screen
 * except Home (which has its own bespoke blue header) and the simple
 * back-arrow-only screens (pass no `title`).
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  rightIcon,
  rightLabel,
  onRightPress,
  style,
  testID,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }, style]} testID={testID}>
      {onBackPress ? (
        <Pressable onPress={onBackPress} style={styles.backButton} hitSlop={8} accessibilityRole="button">
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
      ) : null}

      {title ? (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View style={styles.title} />
      )}

      {rightIcon || rightLabel ? (
        <Pressable
          onPress={onRightPress}
          disabled={!onRightPress}
          style={styles.rightButton}
          hitSlop={8}
          accessibilityRole="button"
        >
          {rightIcon ?? <Text style={styles.rightLabel}>{rightLabel}</Text>}
        </Pressable>
      ) : null}
    </View>
  );
};
