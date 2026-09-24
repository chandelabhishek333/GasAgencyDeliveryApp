/**
 * MBGA Design System — Spacing & Radius Tokens
 *
 * Base unit: 4px. All spacing values are multiples of 4.
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  round: 99,
} as const;

export type SpacingToken = keyof typeof Spacing;
export type BorderRadiusToken = keyof typeof BorderRadius;
