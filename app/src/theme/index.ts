/**
 * Main theme export
 * Centralized design system for ForeSight app
 */

import WeatherColors, { getWeatherGradient, getTemperatureColor, getAlertColor } from './colors';
import Typography from './typography';
import Spacing, { BorderRadius, Shadows, GlassCard, ScreenPadding } from './spacing';

export const Theme = {
  colors: WeatherColors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  glassCard: GlassCard,
  screenPadding: ScreenPadding,
};

// Export helper functions
export {
  WeatherColors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  GlassCard,
  ScreenPadding,
  getWeatherGradient,
  getTemperatureColor,
  getAlertColor,
};

export default Theme;
