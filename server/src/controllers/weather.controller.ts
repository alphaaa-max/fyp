import { Request, Response, NextFunction } from 'express';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { weatherService } from '../services/weather.service';
import { predictionService } from '../services/prediction.service';
import { alertService } from '../services/alert.service';
import { logger } from '../utils/logger';

export const getCurrentWeather = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { lat, lon } = req.params;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new AppError(400, 'Invalid latitude or longitude');
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new AppError(400, 'Latitude must be between -90 and 90, longitude between -180 and 180');
    }

    const weather = await weatherService.getCurrentWeather(latitude, longitude);

    // Generate alerts if user is authenticated
    if (req.user) {
      await alertService.generateAlerts(
        req.user.id,
        `${latitude},${longitude}`,
        weather
      );
    }

    res.json({
      status: 'success',
      data: weather,
    });
  }
);

export const getForecast = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { lat, lon } = req.params;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new AppError(400, 'Invalid latitude or longitude');
    }

    const forecast = await weatherService.getForecast(latitude, longitude);

    res.json({
      status: 'success',
      data: forecast,
    });
  }
);

export const getPredictions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { lat, lon } = req.params;
    const { hours = '24' } = req.query;

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const forecastHours = parseInt(hours as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new AppError(400, 'Invalid latitude or longitude');
    }

    if (isNaN(forecastHours) || forecastHours < 1 || forecastHours > 168) {
      throw new AppError(400, 'Hours must be between 1 and 168 (7 days)');
    }

    // Get current and forecast data to build historical context
    const current = await weatherService.getCurrentWeather(latitude, longitude);
    const forecast = await weatherService.getForecast(latitude, longitude);

    // Extract historical temperature data
    const historicalTemps = [
      current.temperature,
      ...forecast.forecasts.slice(0, 8).map((f) => f.temperature),
    ];

    // Get prediction
    const prediction = await predictionService.predictTemperature(
      latitude,
      longitude,
      historicalTemps,
      forecastHours
    );

    res.json({
      status: 'success',
      data: prediction,
    });
  }
);

export const getForecastHistory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { lat, lon } = req.params;
    const { limit = '10' } = req.query;

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const limitNum = parseInt(limit as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new AppError(400, 'Invalid latitude or longitude');
    }

    const history = await weatherService.getForecastHistory(latitude, longitude, limitNum);

    res.json({
      status: 'success',
      data: history,
    });
  }
);

export const getServiceHealth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const predictionServiceHealthy = await predictionService.healthCheck();

    res.json({
      status: 'success',
      data: {
        weatherApi: 'healthy',
        predictionService: predictionServiceHealthy ? 'healthy' : 'degraded',
      },
    });
  }
);
