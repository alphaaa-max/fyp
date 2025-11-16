import axios from 'axios';
import { WeatherCache, ForecastHistory } from '../models';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/error.middleware';
import { CurrentWeather, WeatherForecast, ForecastItem } from '../types/weather.types';

export class WeatherService {
  private apiKey = config.openWeather.apiKey;
  private baseUrl = config.openWeather.baseUrl;
  private cacheTTL = config.cache.ttlMinutes * 60 * 1000; // Convert to milliseconds
  private useMockData = this.apiKey === 'your-api-key-here' || !this.apiKey || this.apiKey.length < 10;

  constructor() {
    if (this.useMockData) {
      logger.warn('⚠️  OpenWeatherMap API key not configured - using MOCK DATA for development');
      logger.warn('⚠️  Get your free API key at: https://openweathermap.org/appid');
    }
  }

  /**
   * Get current weather with caching
   */
  async getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    // Use mock data if API key is not configured
    if (this.useMockData) {
      return this.getMockCurrentWeather(lat, lon);
    }

    const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;

    // Check cache first
    const cached = await this.getFromCache(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for location: ${cacheKey}`);
      return cached as CurrentWeather;
    }

    logger.debug(`Cache miss for location: ${cacheKey}`);

    // Fetch from API
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
        },
        timeout: 10000,
      });

      const data = response.data;

      const currentWeather: CurrentWeather = {
        location: data.name || 'Unknown',
        latitude: data.coord.lat,
        longitude: data.coord.lon,
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        visibility: data.visibility,
        windSpeed: data.wind.speed,
        windDeg: data.wind.deg,
        cloudiness: data.clouds.all,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezone: data.timezone,
        timestamp: new Date(),
      };

      // Cache the result
      await this.saveToCache(cacheKey, currentWeather);

      logger.info(`Fetched current weather for ${currentWeather.location}`);

      return currentWeather;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('OpenWeatherMap API error:', error.response?.data || error.message);

        // Fallback to mock data if API fails
        logger.warn('Falling back to mock data due to API error');
        return this.getMockCurrentWeather(lat, lon);
      }
      throw error;
    }
  }

  /**
   * Get weather forecast (5 day, 3 hour intervals)
   */
  async getForecast(lat: number, lon: number): Promise<WeatherForecast> {
    // Use mock data if API key is not configured
    if (this.useMockData) {
      return this.getMockForecast(lat, lon);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
        },
        timeout: 10000,
      });

      const data = response.data;

      const forecasts: ForecastItem[] = data.list.map((item: any) => ({
        timestamp: new Date(item.dt * 1000),
        temperature: item.main.temp,
        feelsLike: item.main.feels_like,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        windDeg: item.wind.deg,
        cloudiness: item.clouds.all,
        condition: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        pop: item.pop, // Probability of precipitation
        rain: item.rain?.['3h'],
        snow: item.snow?.['3h'],
      }));

      const forecast: WeatherForecast = {
        location: data.city.name,
        latitude: data.city.coord.lat,
        longitude: data.city.coord.lon,
        forecasts,
      };

      // Store in forecast history
      await this.saveForecastHistory(lat, lon, forecast);

      logger.info(`Fetched forecast for ${forecast.location}`);

      return forecast;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('OpenWeatherMap API error:', error.response?.data || error.message);

        // Fallback to mock data if API fails
        logger.warn('Falling back to mock forecast data due to API error');
        return this.getMockForecast(lat, lon);
      }
      throw error;
    }
  }

  /**
   * Get from cache
   */
  private async getFromCache(location: string): Promise<any | null> {
    try {
      const cache = await WeatherCache.findOne({ location });

      if (!cache) {
        return null;
      }

      // Check if expired
      if (cache.expiresAt < new Date()) {
        // Delete expired cache
        await WeatherCache.deleteOne({ location });
        return null;
      }

      return cache.data;
    } catch (error) {
      logger.error('Cache read error:', error);
      return null;
    }
  }

  /**
   * Save to cache
   */
  private async saveToCache(location: string, data: any): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + this.cacheTTL);

      await WeatherCache.findOneAndUpdate(
        { location },
        { location, data, expiresAt },
        { upsert: true, new: true }
      );
    } catch (error) {
      logger.error('Cache write error:', error);
      // Don't throw - caching is not critical
    }
  }

  /**
   * Save forecast to history
   */
  private async saveForecastHistory(
    lat: number,
    lon: number,
    forecast: WeatherForecast
  ): Promise<void> {
    try {
      const location = `${lat.toFixed(4)},${lon.toFixed(4)}`;

      // Save only the first forecast (closest prediction)
      if (forecast.forecasts.length > 0) {
        await ForecastHistory.create({
          location,
          data: forecast.forecasts[0],
          predictedFor: new Date(forecast.forecasts[0].timestamp),
        });
      }
    } catch (error) {
      logger.error('Forecast history save error:', error);
      // Don't throw - history is not critical
    }
  }

  /**
   * Get historical forecast accuracy
   */
  async getForecastHistory(lat: number, lon: number, limit: number = 10) {
    const location = `${lat.toFixed(4)},${lon.toFixed(4)}`;

    const history = await ForecastHistory.find({ location })
      .sort({ createdAt: -1 })
      .limit(limit);

    return history;
  }

  /**
   * Clear expired cache entries
   */
  async clearExpiredCache(): Promise<number> {
    try {
      const result = await WeatherCache.deleteMany({
        expiresAt: { $lt: new Date() },
      });

      if (result.deletedCount && result.deletedCount > 0) {
        logger.info(`Cleared ${result.deletedCount} expired cache entries`);
      }

      return result.deletedCount || 0;
    } catch (error) {
      logger.error('Cache cleanup error:', error);
      return 0;
    }
  }

  /**
   * Get mock current weather data
   */
  private getMockCurrentWeather(lat: number, lon: number): CurrentWeather {
    const locations: Record<string, string> = {
      '51.5074': 'London',
      '40.7128': 'New York',
      '35.6762': 'Tokyo',
      '48.8566': 'Paris',
      '-33.8688': 'Sydney',
    };

    const locationName = locations[lat.toFixed(4)] || 'Unknown Location';

    logger.info(`[MOCK DATA] Returning mock weather for ${locationName}`);

    return {
      location: locationName,
      latitude: lat,
      longitude: lon,
      temperature: 18 + Math.random() * 10, // 18-28°C
      feelsLike: 17 + Math.random() * 10,
      tempMin: 15 + Math.random() * 5,
      tempMax: 20 + Math.random() * 10,
      pressure: 1013 + Math.random() * 20,
      humidity: 60 + Math.random() * 30,
      visibility: 10000,
      windSpeed: 3 + Math.random() * 5,
      windDeg: Math.random() * 360,
      cloudiness: Math.random() * 100,
      condition: 'Clouds',
      description: 'partly cloudy',
      icon: '02d',
      sunrise: Math.floor(Date.now() / 1000) - 6 * 3600,
      sunset: Math.floor(Date.now() / 1000) + 6 * 3600,
      timezone: 0,
      timestamp: new Date(),
    };
  }

  /**
   * Get mock forecast data
   */
  private getMockForecast(lat: number, lon: number): WeatherForecast {
    const locations: Record<string, string> = {
      '51.5074': 'London',
      '40.7128': 'New York',
      '35.6762': 'Tokyo',
      '48.8566': 'Paris',
      '-33.8688': 'Sydney',
    };

    const locationName = locations[lat.toFixed(4)] || 'Unknown Location';

    logger.info(`[MOCK DATA] Returning mock forecast for ${locationName}`);

    const forecasts: ForecastItem[] = [];
    const now = new Date();

    // Generate 7 days of forecast data
    for (let day = 0; day < 7; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      date.setHours(12, 0, 0, 0); // Noon each day

      const baseTemp = 18 + Math.random() * 10;

      forecasts.push({
        timestamp: date,
        temperature: baseTemp,
        feelsLike: baseTemp - 2 + Math.random() * 4,
        tempMin: baseTemp - 3,
        tempMax: baseTemp + 3,
        pressure: 1010 + Math.random() * 20,
        humidity: 55 + Math.random() * 30,
        windSpeed: 2 + Math.random() * 6,
        windDeg: Math.random() * 360,
        cloudiness: Math.random() * 100,
        condition: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
        description: ['clear sky', 'few clouds', 'light rain'][Math.floor(Math.random() * 3)],
        icon: ['01d', '02d', '10d'][Math.floor(Math.random() * 3)],
        pop: Math.random() * 0.5,
      });
    }

    return {
      location: locationName,
      latitude: lat,
      longitude: lon,
      forecasts,
    };
  }
}

export const weatherService = new WeatherService();
