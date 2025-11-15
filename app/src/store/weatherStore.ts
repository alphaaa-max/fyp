import { create } from 'zustand';
import { CurrentWeather, WeatherForecast, WeatherPrediction } from '../types/weather.types';

interface WeatherState {
  currentWeather: CurrentWeather | null;
  forecast: WeatherForecast | null;
  predictions: WeatherPrediction | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  setCurrentWeather: (weather: CurrentWeather) => void;
  setForecast: (forecast: WeatherForecast) => void;
  setPredictions: (predictions: WeatherPrediction) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearWeather: () => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  currentWeather: null,
  forecast: null,
  predictions: null,
  loading: false,
  error: null,
  lastUpdated: null,

  setCurrentWeather: (weather: CurrentWeather) => {
    set({
      currentWeather: weather,
      lastUpdated: new Date(),
      error: null,
    });
  },

  setForecast: (forecast: WeatherForecast) => {
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
      forecast: null,
      predictions: null,
      error: null,
      lastUpdated: null,
    });
  },
}));
