export const CONSTANTS = {
  // API Routes
  API_PREFIX: '/api',

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Weather update interval (minutes)
  WEATHER_UPDATE_INTERVAL: 30,

  // Alert types
  ALERT_TYPES: {
    SEVERE: 'severe',
    WARNING: 'warning',
    ADVISORY: 'advisory',
    INFO: 'info',
  },

  // Weather conditions
  WEATHER_CONDITIONS: {
    CLEAR: 'Clear',
    CLOUDS: 'Clouds',
    RAIN: 'Rain',
    DRIZZLE: 'Drizzle',
    THUNDERSTORM: 'Thunderstorm',
    SNOW: 'Snow',
    MIST: 'Mist',
    FOG: 'Fog',
  },

  // Temperature thresholds (Celsius)
  TEMP_THRESHOLDS: {
    EXTREME_HOT: 40,
    HOT: 35,
    WARM: 25,
    MILD: 15,
    COOL: 10,
    COLD: 0,
    EXTREME_COLD: -10,
  },

  // UV Index thresholds
  UV_THRESHOLDS: {
    LOW: 2,
    MODERATE: 5,
    HIGH: 7,
    VERY_HIGH: 10,
    EXTREME: 11,
  },
} as const;
