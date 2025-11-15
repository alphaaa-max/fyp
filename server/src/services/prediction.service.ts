import axios from 'axios';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { PredictionCache } from '../models';
import { PredictionResponse } from '../types/weather.types';

export class PredictionService {
  private baseUrl = config.predictionService.url;
  private cacheTTL = 60 * 60 * 1000; // 1 hour cache for predictions

  /**
   * Predict temperature with caching
   */
  async predictTemperature(
    lat: number,
    lon: number,
    historicalData: number[],
    hours: number = 24
  ): Promise<PredictionResponse> {
    const location = `${lat.toFixed(4)},${lon.toFixed(4)}`;

    // Check cache
    const cached = await this.getFromCache(location, 'temperature');
    if (cached) {
      logger.debug(`Prediction cache hit for ${location}`);
      return cached;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/predict/temperature`,
        {
          historical_data: historicalData,
          location,
          forecast_hours: hours,
        },
        {
          timeout: 10000,
        }
      );

      const prediction: PredictionResponse = {
        predictions: {
          temperature: response.data.predictions,
          humidity: [],
          rainfall: [],
        },
        confidence: response.data.confidence,
        modelVersion: response.data.model_version,
      };

      // Cache the result
      await this.saveToCache(location, 'temperature', prediction);

      logger.info(`Generated temperature prediction for ${location}`);

      return prediction;
    } catch (error) {
      logger.error('Prediction service error:', error);
      // Return fallback prediction
      return this.fallbackPrediction(historicalData, hours);
    }
  }

  /**
   * Simple fallback prediction (moving average)
   */
  private fallbackPrediction(data: number[], hours: number): PredictionResponse {
    const avg = data.reduce((a, b) => a + b, 0) / data.length;

    return {
      predictions: {
        temperature: Array(hours).fill(avg),
        humidity: [],
        rainfall: [],
      },
      confidence: 0.5,
      modelVersion: 'fallback',
    };
  }

  /**
   * Check if prediction service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/health`, {
        timeout: 3000,
      });
      return response.data.status === 'healthy';
    } catch (error) {
      logger.warn('Prediction service health check failed');
      return false;
    }
  }

  /**
   * Get prediction from cache
   */
  private async getFromCache(location: string, type: string): Promise<PredictionResponse | null> {
    try {
      const cache = await PredictionCache.findOne({ location, type });

      if (!cache) {
        return null;
      }

      if (cache.expiresAt < new Date()) {
        await PredictionCache.deleteOne({ location, type });
        return null;
      }

      return cache.data as PredictionResponse;
    } catch (error) {
      logger.error('Prediction cache read error:', error);
      return null;
    }
  }

  /**
   * Save prediction to cache
   */
  private async saveToCache(
    location: string,
    type: string,
    data: PredictionResponse
  ): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + this.cacheTTL);

      await PredictionCache.findOneAndUpdate(
        { location, type },
        { location, type, data, expiresAt },
        { upsert: true, new: true }
      );
    } catch (error) {
      logger.error('Prediction cache write error:', error);
    }
  }
}

export const predictionService = new PredictionService();
