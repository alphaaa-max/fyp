/**
 * Formatting utilities for weather data display
 */
import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format temperature with unit
 */
export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  if (unit === 'F') {
    temp = (temp * 9) / 5 + 32;
  }
  return `${Math.round(temp)}°${unit}`;
};

/**
 * Format wind speed
 */
export const formatWindSpeed = (speed: number): string => {
  return `${speed.toFixed(1)} m/s`;
};

/**
 * Format humidity
 */
export const formatHumidity = (humidity: number): string => {
  return `${Math.round(humidity)}%`;
};

/**
 * Format pressure
 */
export const formatPressure = (pressure: number): string => {
  return `${pressure} hPa`;
};

/**
 * Format visibility
 */
export const formatVisibility = (visibility: number): string => {
  const km = visibility / 1000;
  return `${km.toFixed(1)} km`;
};

/**
 * Format time from unix timestamp
 */
export const formatTime = (timestamp: number): string => {
  return format(new Date(timestamp * 1000), 'HH:mm');
};

/**
 * Format date
 */
export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

/**
 * Format date and time
 */
export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, HH:mm');
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Get wind direction from degrees
 */
export const getWindDirection = (deg: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

/**
 * Format probability of precipitation
 */
export const formatPOP = (pop: number): string => {
  return `${Math.round(pop * 100)}%`;
};
