/**
 * Alert API endpoints
 */
import api from './api';
import { WeatherAlert } from '../types/weather.types';

export const alertApi = {
  /**
   * Get user alerts
   */
  getAlerts: async (unreadOnly: boolean = false): Promise<WeatherAlert[]> => {
    const response = await api.get<{ status: string; data: WeatherAlert[] }>('/alerts', {
      params: { unreadOnly },
    });
    return response.data.data;
  },

  /**
   * Mark alert as read
   */
  markAsRead: async (alertId: string): Promise<WeatherAlert> => {
    const response = await api.put<{ status: string; data: WeatherAlert }>(
      `/alerts/${alertId}/read`
    );
    return response.data.data;
  },
};
