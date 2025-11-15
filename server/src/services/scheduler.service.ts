import cron from 'node-cron';
import { weatherService } from './weather.service';
import { alertService } from './alert.service';
import { logger } from '../utils/logger';
import { Location } from '../models';

export class SchedulerService {
  private tasks: cron.ScheduledTask[] = [];

  /**
   * Start all scheduled tasks
   */
  start() {
    logger.info('Starting scheduler service...');

    // Update weather data every 30 minutes
    this.tasks.push(
      cron.schedule('*/30 * * * *', async () => {
        logger.info('Running scheduled weather update...');
        await this.updateAllLocationsWeather();
      })
    );

    // Clear expired cache every hour
    this.tasks.push(
      cron.schedule('0 * * * *', async () => {
        logger.info('Running cache cleanup...');
        await weatherService.clearExpiredCache();
      })
    );

    // Deactivate old alerts every 6 hours
    this.tasks.push(
      cron.schedule('0 */6 * * *', async () => {
        logger.info('Running alert cleanup...');
        await alertService.deactivateOldAlerts(24);
      })
    );

    logger.info(`✅ Scheduler started with ${this.tasks.length} tasks`);
  }

  /**
   * Stop all scheduled tasks
   */
  stop() {
    this.tasks.forEach((task) => task.stop());
    logger.info('Scheduler stopped');
  }

  /**
   * Update weather for all user locations
   */
  private async updateAllLocationsWeather() {
    try {
      // Get all unique locations from users
      const locations = await Location.find()
        .select('latitude longitude')
        .distinct('latitude');

      logger.info(`Updating weather for ${locations.length} locations`);

      let updated = 0;
      let failed = 0;

      for (const location of locations) {
        try {
          await weatherService.getCurrentWeather(location.latitude, location.longitude);
          updated++;
        } catch (error) {
          logger.error(`Failed to update weather for ${location.latitude},${location.longitude}:`, error);
          failed++;
        }

        // Add small delay to avoid rate limiting
        await this.sleep(100);
      }

      logger.info(`Weather update complete: ${updated} updated, ${failed} failed`);
    } catch (error) {
      logger.error('Scheduled weather update failed:', error);
    }
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const schedulerService = new SchedulerService();
