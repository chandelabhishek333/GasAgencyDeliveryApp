/**
 * MBGA Design System — Typography Tokens
 *
 * Font family: Inter, loaded via @expo-google-fonts/inter and
 * App.tsx's `useFonts` call (see App.tsx). Reference weights by
 * `FontFamily.<weight>` rather than passing `fontWeight` directly —
 * each of these is a real distinct font file, not a synthetic
 * fontWeight on a single regular face, so "black" actually renders
 * heavier than "bold" on both platforms.
 */
export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
  black: 'Inter_900Black',
} as const;

/**
 * Numeric fallback for platforms/components that require a `fontWeight`
 * string alongside `fontFamily` (e.g. web preview, third-party libs).
 */
export const FontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
} as const;

/**
 * Font size scale, tuned for real mobile screens (not the desktop/web
 * preview these were originally eyeballed against). Named by role so
 * screens stay readable; roughly:
 *   captions/badges  11-12px
 *   body/subtitles   14-15px
 *   headings/titles  18-22px
 *   buttons          16px
 */
export const FontSize = {
  caption2: 11, // timestamps, micro hints, dot labels
  caption1: 11, // small labels, notification time
  footnote: 12, // secondary body text, helper copy
  small: 12, // placeholders, item meta
  subtitle: 13, // card subtitles, secondary info
  label: 13, // section titles, item titles
  labelLg: 14, // pill badges, emphasized labels
  button: 15, // outline / secondary button text
  buttonLg: 16, // primary CTA text
  bodySm: 14, // CTA emphasis, stat values
  body: 15, // section values, order id
  bodyLg: 16, // screen titles (compact)
  subheading: 18, // screen titles, driver name
  heading: 20, // welcome text, dashboard headers
  headingLg: 22, // success screen title
  display: 32, // splash "MBGA" wordmark
} as const;

/**
 * Line-height multipliers (applied as `fontSize * multiplier`) for the
 * line-height ratios referenced across screen specs.
 */
export const LineHeight = {
  tight: 1.4,
  normal: 1.5,
  relaxed: 1.7,
} as const;

/**
 * Letter-spacing values (in px) referenced across screen specs.
 */
export const LetterSpacing = {
  tight: 0.5,
  normal: 0.8,
  wide: 1,
  wider: 2,
} as const;

export type FontFamilyToken = keyof typeof FontFamily;
export type FontSizeToken = keyof typeof FontSize;
