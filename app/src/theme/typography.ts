/**
 * Typography system for ForeSight app
 * Designed for optimal readability and weather data display
 */

export const Typography = {
  // Large temperature displays
  temperature: {
    fontSize: 72,
    fontWeight: '200' as const,
    lineHeight: 86,
    letterSpacing: -2,
  },

  // Weather condition
  headline: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: 0.25,
  },

  // Section titles
  title: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 30,
    letterSpacing: 0,
  },

  // Location, time
  subheadline: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0.15,
  },

  // Details (humidity, wind, etc.)
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: 0.5,
  },

  // Secondary information
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0.25,
  },

  // Small labels, timestamps
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.4,
  },

  // Buttons
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 1.25,
    textTransform: 'uppercase' as const,
  },

  // Input fields
  input: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0.15,
  },

  // Forecast values
  forecast: {
    fontSize: 20,
    fontWeight: '500' as const,
    lineHeight: 26,
    letterSpacing: 0,
  },
};

/**
 * Font families (can be customized with custom fonts)
 */
export const FontFamily = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
  light: 'System',
};

export default Typography;
