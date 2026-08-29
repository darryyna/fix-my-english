// color pallette for the app
export const colors = {
  // Backgrounds
  background: '#0A0E1B',   // app background
  surface: '#121729',      // cards, inputs
  surfaceAlt: '#1A2138',   // pressed / elevated surface
  border: '#232B45',

  // Brand / accent
  primary: '#5B7FFF',
  primaryPressed: '#4A6BE0',
  primaryMuted: 'rgba(91, 127, 255, 0.14)',

  // Text
  text: '#EAEEFB',
  textSecondary: '#9AA4C2',
  textMuted: '#6B7494',

  // Status
  success: '#3ECF8E',
  warning: '#F5B84C',
  danger: '#FF6B6B',

  // Progress bar tracks per module
  vocabulary: '#5B7FFF',
  grammar: '#3ECF8E',

  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: 20, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text },
  bodySecondary: { fontSize: 14, fontWeight: '400' as const, color: colors.textSecondary },
  caption: { fontSize: 12, fontWeight: '500' as const, color: colors.textMuted },
  button: { fontSize: 16, fontWeight: '600' as const, color: colors.white },
};
