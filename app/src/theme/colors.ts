/**
 * Weather-focused color palette for ForeSight app
 * Inspired by modern weather applications with dynamic gradients
 */

export const WeatherColors = {
  // Primary - Sky gradients for different weather conditions
  sky: {
    clearDay: ['#4A90E2', '#87CEEB', '#B0E0E6'],
    clearNight: ['#0F2027', '#203A43', '#2C5364'],
    cloudy: ['#757F9A', '#D7DDE8'],
    rainy: ['#4B79A1', '#283E51'],
    stormy: ['#373B44', '#4286f4'],
    sunny: ['#F7971E', '#FFD200'],
    snowy: ['#E6DADA', '#274046'],
    misty: ['#bdc3c7', '#2c3e50'],
  },

  // Temperature-based colors
  temperature: {
    extremeHot: '#E74C3C',    // Above 40°C - Red
    hot: '#FF6B6B',           // 30-40°C - Light Red
    warm: '#FFA07A',          // 20-30°C - Orange
    mild: '#FFD93D',          // 10-20°C - Yellow
    cool: '#6BCB77',          // 0-10°C - Green
    cold: '#4D96FF',          // -10-0°C - Blue
    extremeCold: '#3742fa',   // Below -10°C - Dark Blue
  },

  // UI colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    dark: '#1E1E1E',
    card: 'rgba(255, 255, 255, 0.15)',  // Glassmorphism
  },

  text: {
    primary: '#212121',
    secondary: '#757575',
    tertiary: '#9E9E9E',
    inverse: '#FFFFFF',
    light: '#E0E0E0',
  },

  // Alert colors (matching backend alert types)
  alerts: {
    severe: '#E53935',        // Severe weather
    warning: '#FB8C00',       // Warning
    advisory: '#FDD835',      // Advisory
    info: '#1E88E5',          // Information
  },

  // Accent colors
  accent: {
    primary: '#4A90E2',
    secondary: '#5AB9EA',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
  },

  // Chart colors
  charts: {
    temperature: '#FF6B6B',
    humidity: '#4D96FF',
    wind: '#6BCB77',
    rainfall: '#4A90E2',
    pressure: '#9C27B0',
  },

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

/**
 * Get gradient colors based on weather condition
 */
export const getWeatherGradient = (condition: string, isDay: boolean = true): string[] => {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return isDay ? WeatherColors.sky.sunny : WeatherColors.sky.clearNight;
  }

  if (conditionLower.includes('cloud')) {
    return WeatherColors.sky.cloudy;
  }

  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return WeatherColors.sky.rainy;
  }

  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return WeatherColors.sky.stormy;
  }

  if (conditionLower.includes('snow')) {
    return WeatherColors.sky.snowy;
  }

  if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
    return WeatherColors.sky.misty;
  }

  return isDay ? WeatherColors.sky.clearDay : WeatherColors.sky.clearNight;
};

/**
 * Get color based on temperature
 */
export const getTemperatureColor = (temp: number): string => {
  if (temp >= 40) return WeatherColors.temperature.extremeHot;
  if (temp >= 30) return WeatherColors.temperature.hot;
  if (temp >= 20) return WeatherColors.temperature.warm;
  if (temp >= 10) return WeatherColors.temperature.mild;
  if (temp >= 0) return WeatherColors.temperature.cool;
  if (temp >= -10) return WeatherColors.temperature.cold;
  return WeatherColors.temperature.extremeCold;
};

/**
 * Get alert color based on type
 */
export const getAlertColor = (type: 'severe' | 'warning' | 'advisory' | 'info'): string => {
  return WeatherColors.alerts[type];
};

export default WeatherColors;
