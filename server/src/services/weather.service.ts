import axios from 'axios';
import { prisma } from '../config/database';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/error.middleware';
import { CurrentWeather, WeatherForecast, ForecastItem } from '../types/weather.types';

export class WeatherService {
  private apiKey = config.openWeather.apiKey;
  private baseUrl = config.openWeather.baseUrl;
  private cacheTTL = config.cache.ttlMinutes * 60 * 1000; // Convert to milliseconds

  /**
   * Get current weather with caching
   */
  async getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
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
        throw new AppError(502, 'Failed to fetch weather data');
      }
      throw error;
    }
  }

  /**
   * Get weather forecast (5 day, 3 hour intervals)
   */
  async getForecast(lat: number, lon: number): Promise<WeatherForecast> {
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
        throw new AppError(502, 'Failed to fetch forecast data');
      }
      throw error;
    }
  }

  /**
   * Get from cache
   */
  private async getFromCache(location: string): Promise<any | null> {
    try {
      const cache = await prisma.weatherCache.findUnique({
        where: { location },
      });

      if (!cache) {
        return null;
      }

      // Check if expired
      if (cache.expiresAt < new Date()) {
        // Delete expired cache
        await prisma.weatherCache.delete({
          where: { location },
        });
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

      await prisma.weatherCache.upsert({
        where: { location },
        create: {
          location,
          data,
          expiresAt,
        },
        update: {
          data,
          expiresAt,
        },
      });
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
        await prisma.forecastHistory.create({
          data: {
            location,
            data: forecast.forecasts[0],
            predictedFor: forecast.forecasts[0].timestamp,
          },
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

    const history = await prisma.forecastHistory.findMany({
      where: { location },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return history;
  }

  /**
   * Clear expired cache entries
   */
  async clearExpiredCache(): Promise<number> {
    try {
      const result = await prisma.weatherCache.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      if (result.count > 0) {
        logger.info(`Cleared ${result.count} expired cache entries`);
      }

      return result.count;
    } catch (error) {
      logger.error('Cache cleanup error:', error);
      return 0;
    }
  }
}

export const weatherService = new WeatherService();
