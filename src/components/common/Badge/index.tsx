import React from 'react';
import { Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import { styles } from './styles';
import type { BadgeProps, BadgeSize, BadgeVariant } from './types';

const CONTAINER_STYLE_BY_VARIANT: Record<BadgeVariant, ViewStyle> = {
  pending: styles.pending,
  inProgress: styles.inProgress,
  completed: styles.completed,
  delivered: styles.delivered,
  info: styles.info,
};

const LABEL_STYLE_BY_VARIANT: Record<BadgeVariant, TextStyle> = {
  pending: styles.pendingLabel,
  inProgress: styles.inProgressLabel,
  completed: styles.completedLabel,
  delivered: styles.deliveredLabel,
  info: styles.infoLabel,
};

const CONTAINER_STYLE_BY_SIZE: Record<BadgeSize, ViewStyle> = {
  sm: styles.sm,
  md: styles.md,
};

const LABEL_STYLE_BY_SIZE: Record<BadgeSize, TextStyle> = {
  sm: styles.labelSm,
  md: styles.labelMd,
};

/** Small status pill — pending/inProgress/completed/delivered/info. */
export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'pending',
  size = 'md',
  showChevron = false,
  style,
  testID,
}) => {
  const labelStyle = [LABEL_STYLE_BY_SIZE[size], LABEL_STYLE_BY_VARIANT[variant]];

  return (
    <View
      style={[styles.base, CONTAINER_STYLE_BY_SIZE[size], CONTAINER_STYLE_BY_VARIANT[variant], style]}
      testID={testID}
    >
      <Text style={labelStyle}>{label}</Text>
      {showChevron ? <Text style={[labelStyle, styles.chevron]}>›</Text> : null}
    </View>
  );
};
