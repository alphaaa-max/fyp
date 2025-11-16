import { create } from 'zustand';
import { CurrentWeather, WeatherForecast, WeatherPrediction, ForecastItem } from '../types/weather.types';
import { weatherApi } from '../services';

// Default coordinates for demo (London)
const DEFAULT_LAT = 51.5074;
const DEFAULT_LON = -0.1278;

// Location name to coordinates mapping for demo
const LOCATION_COORDS: Record<string, { lat: number; lon: number }> = {
  'London': { lat: 51.5074, lon: -0.1278 },
  'New York': { lat: 40.7128, lon: -74.0060 },
  'Tokyo': { lat: 35.6762, lon: 139.6503 },
  'Paris': { lat: 48.8566, lon: 2.3522 },
  'Sydney': { lat: -33.8688, lon: 151.2093 },
};

interface WeatherState {
  currentWeather: CurrentWeather | null;
  forecast: ForecastItem[];
  predictions: WeatherPrediction | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  fetchCurrentWeather: (location: string) => Promise<void>;
  fetchForecast: (location: string, days?: number) => Promise<void>;
  fetchPredictions: (location: string, hours?: number) => Promise<void>;
  setCurrentWeather: (weather: CurrentWeather) => void;
  setForecast: (forecast: ForecastItem[]) => void;
  setPredictions: (predictions: WeatherPrediction) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearWeather: () => void;
}

/**
 * Get coordinates from location name
 */
const getCoordinates = (location: string): { lat: number; lon: number } => {
  const coords = LOCATION_COORDS[location];
  if (coords) {
    return coords;
  }
  // Default to London if location not found
  console.warn(`Location "${location}" not found, using London as default`);
  return { lat: DEFAULT_LAT, lon: DEFAULT_LON };
};

export const useWeatherStore = create<WeatherState>((set, get) => ({
  currentWeather: null,
  forecast: [],
  predictions: null,
  loading: false,
  error: null,
  lastUpdated: null,

  /**
   * Fetch current weather for a location
   */
  fetchCurrentWeather: async (location: string) => {
    set({ loading: true, error: null });
    try {
      const { lat, lon } = getCoordinates(location);
      const weather = await weatherApi.getCurrentWeather(lat, lon);
      set({
        currentWeather: weather,
        lastUpdated: new Date(),
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Failed to fetch current weather:', error);
      set({
        error: error.message || 'Failed to fetch weather data',
        loading: false,
      });
      throw error;
    }
  },

  /**
   * Fetch weather forecast for a location
   */
  fetchForecast: async (location: string, days: number = 7) => {
    set({ loading: true, error: null });
    try {
      const { lat, lon } = getCoordinates(location);
      const forecastData = await weatherApi.getForecast(lat, lon);

      // Extract forecast items and limit to requested days
      const forecastItems = forecastData.forecasts.slice(0, days);

      set({
        forecast: forecastItems,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Failed to fetch forecast:', error);
      set({
        error: error.message || 'Failed to fetch forecast data',
        loading: false,
      });
      throw error;
    }
  },

  /**
   * Fetch weather predictions for a location
   */
  fetchPredictions: async (location: string, hours: number = 24) => {
    set({ loading: true, error: null });
    try {
      const { lat, lon } = getCoordinates(location);
      const predictions = await weatherApi.getPredictions(lat, lon, hours);
      set({
        predictions,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Failed to fetch predictions:', error);
      set({
        error: error.message || 'Failed to fetch predictions',
        loading: false,
      });
      throw error;
    }
  },

  setCurrentWeather: (weather: CurrentWeather) => {
    set({
      currentWeather: weather,
      lastUpdated: new Date(),
      error: null,
    });
  },

  setForecast: (forecast: ForecastItem[]) => {
    set({
      forecast,
      error: null,
    });
  },

  setPredictions: (predictions: WeatherPrediction) => {
    set({
      predictions,
      error: null,
    });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error, loading: false });
  },

  clearWeather: () => {
    set({
      currentWeather: null,
      forecast: [],
      predictions: null,
      error: null,
      lastUpdated: null,
    });
  },
}));
