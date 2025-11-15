/**
 * Weather API endpoints
 */
import api from './api';
import { CurrentWeather, WeatherForecast, WeatherPrediction } from '../types/weather.types';

export const weatherApi = {
  /**
   * Get current weather for location
   */
  getCurrentWeather: async (lat: number, lon: number): Promise<CurrentWeather> => {
    const response = await api.get<{ status: string; data: CurrentWeather }>(
      `/weather/current/${lat}/${lon}`
    );
    return response.data.data;
  },

  /**
   * Get weather forecast
   */
  getForecast: async (lat: number, lon: number): Promise<WeatherForecast> => {
    const response = await api.get<{ status: string; data: WeatherForecast }>(
      `/weather/forecast/${lat}/${lon}`
    );
    return response.data.data;
  },

  /**
   * Get AI-powered predictions
   */
  getPredictions: async (
    lat: number,
    lon: number,
    hours: number = 24
  ): Promise<WeatherPrediction> => {
    const response = await api.get<{ status: string; data: WeatherPrediction }>(
      `/weather/predictions/${lat}/${lon}`,
      { params: { hours } }
    );
    return response.data.data;
  },

  /**
   * Get forecast history
   */
  getHistory: async (lat: number, lon: number, limit: number = 10) => {
    const response = await api.get(`/weather/history/${lat}/${lon}`, {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get service health
   */
  getHealth: async () => {
    const response = await api.get('/weather/health');
    return response.data.data;
  },
};
