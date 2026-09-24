/**
 * MBGA Design System — Color Tokens
 *
 * Do not use raw hex values in components/screens — always reference
 * `Colors.<token>` so brand changes stay a one-file edit.
 */
export const Colors = {
  // Primary Brand Colors
  primary: '#0067A5', // MBGA Blue — headers, CTAs, active nav, buttons
  secondary: '#FF6B00', // MBGA Orange — primary action buttons, badges, accents

  // Backgrounds
  bgWhite: '#FFFFFF',
  bgLight: '#F4F6F9', // Dashboard / general screen background
  bgCard: '#F8FAFB', // Cards, list items
  bgInputField: '#FAFAFA',

  // Primary Light Variants
  primaryLight: '#E6F2FA', // Blue light background (badges, chips)
  primaryBorder: '#B8D8F0', // Blue border
  secondaryLight: '#FFF0E6', // Orange light background
  secondaryLightBorder: '#FFE0CC',

  // Status Colors
  successGreen: '#16A34A',
  successLight: '#E6FAF0',
  successBorder: '#CDEFD8',
  warningYellow: '#D97706',
  warningLight: '#FEF3C7',
  errorRed: '#EF4444',
  // Not in the original palette table — the Customer OTP screen spec
  // gives error only as a base color, with no light/border pair
  // (unlike success/warning). Added to match that pattern for Toast.
  errorLight: '#FEE2E2',
  errorBorder: '#FECACA',

  // Text
  textPrimary: '#0F172A', // Main headings
  textSecondary: '#111111', // Body text
  textMuted: '#64748B', // Labels, subtitles
  textLight: '#94A3B8', // Timestamps, hints
  // Not in the original table — several screens specify #333 for
  // secondary-emphasis text (e.g. customer name in a list row), a
  // tier meaningfully darker than textMuted but lighter than
  // textSecondary. Other narrative one-off grays (#555, #666, #888,
  // #475569, #9CA3AF, etc.) are close enough to map onto textMuted /
  // textLight rather than each minting its own token.
  textDark: '#333333',
  textPlaceholder: '#AAAAAA',

  // Borders & Dividers
  borderLight: '#E2E8F0',
  borderCard: '#EAECEF',
  borderInput: '#DDDDDD',
  divider: '#F0F0F0',

  // Gradient backgrounds
  gradientSplashStart: '#EAF2FF',
  // Middle stop (40%) of Splash's 3-stop gradient — missing from the
  // original table; recovered from the reference mockup.
  gradientSplashMid: '#F5F9FF',
  gradientSplashEnd: '#FFF8F0',
  gradientLoginStart: '#EAF1F8',
  gradientLoginEnd: '#F5F9FC',
  // OTP screen's gradient is distinct from Login's, not a reuse — also
  // missing from the original table, recovered from the reference mockup.
  gradientOtpStart: '#EBF2F8',
  gradientOtpEnd: '#F6F9FC',

  // Status Badges
  badgePendingBg: '#FFF0E6',
  badgePendingText: '#FF6B00',
  badgeInProgressBg: '#E6F2FA',
  badgeInProgressText: '#0067A5',
  badgeDoneBg: '#E8F8EE',
  badgeDoneText: '#16A34A',
  badgeDoneSmBg: '#4CAF50',

  // Dashboard stat-grid cells (Today's Deliveries breakdown) — a
  // close-but-distinct tint from the Status Badges above, confirmed
  // via the reference mockup, not a copy/paste slip. Text reuses
  // secondary/primary/successGreen, matching the badges' text colors.
  statPendingBg: '#FFF3EB',
  statPendingBorder: '#FFE0CC',
  statInProgressBg: '#EBF5FB',
  statInProgressBorder: '#D4EBF8',
  statCompletedBg: '#EAF8F0',
  statCompletedBorder: '#CDEFD8',

  // OTP Input (Customer OTP screen's empty/inactive box state — the
  // Duty OTP screen's pre-filled boxes reuse `secondary`/`bgWhite`)
  otpInactiveBorder: '#CBD5E1',
  otpInactiveBg: '#F8FAFC',

  // Nav / Tab Bar
  navBarBg: '#FFFFFF',
  navBarBorder: '#EEEEEE',
  navItemActive: '#FF6B00',
  navItemInactive: '#64748B', // slate — was a flat mid-gray, matches textMuted now

  // Safety Banner
  safetyBg: '#FFFBEB',
  safetyBorder: '#FDE68A',
  safetyText: '#78350F',

  // Info Card
  infoBg: '#EEF4FF',
  infoBorder: '#C7D9F0',
  infoText: '#0067A5',

  // Misc
  white: '#FFFFFF',
  black: '#111111',
  transparent: 'transparent',
  overlayWhite: 'rgba(255,255,255,0.7)',
  shadowBlue: 'rgba(0,103,165,0.4)',
  shadowOrange: 'rgba(255,107,0,0.3)',
  shadowCard: 'rgba(0,0,0,0.05)',
} as const;

export type ColorToken = keyof typeof Colors;
