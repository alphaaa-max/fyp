import { create } from 'zustand';
import { WeatherAlert } from '../types/weather.types';

interface AlertState {
  alerts: WeatherAlert[];
  unreadCount: number;
  loading: boolean;

  // Actions
  setAlerts: (alerts: WeatherAlert[]) => void;
  markAsRead: (alertId: string) => void;
  addAlert: (alert: WeatherAlert) => void;
  setLoading: (loading: boolean) => void;
  clearAlerts: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  unreadCount: 0,
  loading: false,

  setAlerts: (alerts: WeatherAlert[]) => {
    const unreadCount = alerts.filter((alert) => !alert.isRead).length;
    set({ alerts, unreadCount });
  },

  markAsRead: (alertId: string) => {
    set((state) => {
      const updatedAlerts = state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      );
      const unreadCount = updatedAlerts.filter((alert) => !alert.isRead).length;
      return { alerts: updatedAlerts, unreadCount };
    });
  },

  addAlert: (alert: WeatherAlert) => {
    set((state) => {
      const alerts = [alert, ...state.alerts];
      const unreadCount = alerts.filter((alert) => !alert.isRead).length;
      return { alerts, unreadCount };
    });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  clearAlerts: () => {
    set({ alerts: [], unreadCount: 0 });
  },
}));
