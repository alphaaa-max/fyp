/**
 * Spacing system for consistent layout
 * Based on 8px grid system
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

/**
 * Border radius values
 */
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

/**
 * Shadow styles
 */
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
};

/**
 * Glassmorphism card style
 */
export const GlassCard = {
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  borderRadius: BorderRadius.xl,
  padding: Spacing.md,
  ...Shadows.md,
};

/**
 * Screen padding
 */
export const ScreenPadding = {
  horizontal: Spacing.md,
  vertical: Spacing.lg,
};

export default Spacing;
