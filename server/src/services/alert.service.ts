import { Alert } from '../models';
import { logger } from '../utils/logger';
import { CONSTANTS } from '../config/constants';
import { CurrentWeather } from '../types/weather.types';
import { WeatherAlert } from '../types/weather.types';

export class AlertService {
  /**
   * Generate weather alerts based on conditions
   */
  async generateAlerts(
    userId: string,
    location: string,
    weather: CurrentWeather
  ): Promise<WeatherAlert[]> {
    const alerts: Omit<WeatherAlert, 'id'>[] = [];

    // Extreme temperature alerts
    if (weather.temperature >= CONSTANTS.TEMP_THRESHOLDS.EXTREME_HOT) {
      alerts.push({
        type: 'severe',
        title: 'Extreme Heat Warning',
        message: `Temperature is ${weather.temperature.toFixed(1)}°C. Stay indoors and stay hydrated.`,
        location,
        severity: 5,
        startTime: new Date(),
        isActive: true,
      });
    } else if (weather.temperature >= CONSTANTS.TEMP_THRESHOLDS.HOT) {
      alerts.push({
        type: 'warning',
        title: 'High Temperature',
        message: `Temperature is ${weather.temperature.toFixed(1)}°C. Limit outdoor activities.`,
        location,
        severity: 3,
        startTime: new Date(),
        isActive: true,
      });
    } else if (weather.temperature <= CONSTANTS.TEMP_THRESHOLDS.EXTREME_COLD) {
      alerts.push({
        type: 'severe',
        title: 'Extreme Cold Warning',
        message: `Temperature is ${weather.temperature.toFixed(1)}°C. Risk of frostbite.`,
        location,
        severity: 5,
        startTime: new Date(),
        isActive: true,
      });
    } else if (weather.temperature <= CONSTANTS.TEMP_THRESHOLDS.COLD) {
      alerts.push({
        type: 'warning',
        title: 'Freezing Temperature',
        message: `Temperature is ${weather.temperature.toFixed(1)}°C. Dress warmly.`,
        location,
        severity: 3,
        startTime: new Date(),
        isActive: true,
      });
    }

    // Storm alerts
    if (weather.condition === CONSTANTS.WEATHER_CONDITIONS.THUNDERSTORM) {
      alerts.push({
        type: 'severe',
        title: 'Thunderstorm Alert',
        message: 'Thunderstorm detected. Seek shelter immediately.',
        location,
        severity: 4,
        startTime: new Date(),
        isActive: true,
      });
    }

    // Heavy rain alerts
    if (weather.condition === CONSTANTS.WEATHER_CONDITIONS.RAIN && weather.windSpeed > 10) {
      alerts.push({
        type: 'warning',
        title: 'Heavy Rain Warning',
        message: 'Heavy rain with strong winds. Avoid unnecessary travel.',
        location,
        severity: 3,
        startTime: new Date(),
        isActive: true,
      });
    }

    // High wind alerts
    if (weather.windSpeed > 20) {
      alerts.push({
        type: 'warning',
        title: 'High Wind Warning',
        message: `Wind speed is ${weather.windSpeed.toFixed(1)} m/s. Secure loose objects.`,
        location,
        severity: 3,
        startTime: new Date(),
        isActive: true,
      });
    }

    // Poor visibility alerts
    if (weather.visibility < 1000) {
      alerts.push({
        type: 'advisory',
        title: 'Poor Visibility',
        message: `Visibility is ${weather.visibility}m. Drive carefully.`,
        location,
        severity: 2,
        startTime: new Date(),
        isActive: true,
      });
    }

    // Save alerts to database
    for (const alert of alerts) {
      try {
        await Alert.create({
          userId,
          ...alert,
        });
      } catch (error) {
        logger.error('Failed to save alert:', error);
      }
    }

    logger.info(`Generated ${alerts.length} alerts for user ${userId}`);

    return alerts as WeatherAlert[];
  }

  /**
   * Get active alerts for user
   */
  async getUserAlerts(userId: string, unreadOnly: boolean = false) {
    const query: any = {
      userId,
      isActive: true,
    };

    if (unreadOnly) {
      query.isRead = false;
    }

    const alerts = await Alert.find(query)
      .sort({ severity: -1, createdAt: -1 });

    return alerts;
  }

  /**
   * Mark alert as read
   */
  async markAlertAsRead(alertId: string, userId: string) {
    const alert = await Alert.findById(alertId);

    if (!alert || alert.userId.toString() !== userId) {
      throw new Error('Alert not found');
    }

    return Alert.findByIdAndUpdate(
      alertId,
      { isRead: true },
      { new: true }
    );
  }

  /**
   * Deactivate old alerts
   */
  async deactivateOldAlerts(hoursOld: number = 24) {
    const cutoffTime = new Date(Date.now() - hoursOld * 60 * 60 * 1000);

    const result = await Alert.updateMany(
      {
        createdAt: { $lt: cutoffTime },
        isActive: true,
      },
      {
        isActive: false,
      }
    );

    if (result.modifiedCount && result.modifiedCount > 0) {
      logger.info(`Deactivated ${result.modifiedCount} old alerts`);
    }

    return result.modifiedCount || 0;
  }
}

export const alertService = new AlertService();
