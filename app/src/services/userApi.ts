/**
 * User API endpoints
 */
import api from './api';
import { User, Location } from '../types/user.types';

export const userApi = {
  /**
   * Update user profile
   */
  updateProfile: async (data: { name?: string; email?: string }): Promise<User> => {
    const response = await api.put<{ status: string; data: User }>('/user/profile', data);
    return response.data.data;
  },

  /**
   * Get saved locations
   */
  getLocations: async (): Promise<Location[]> => {
    const response = await api.get<{ status: string; data: Location[] }>('/user/locations');
    return response.data.data;
  },

  /**
   * Add a new location
   */
  addLocation: async (data: {
    name: string;
    latitude: number;
    longitude: number;
    isPrimary?: boolean;
  }): Promise<Location> => {
    const response = await api.post<{ status: string; data: Location }>(
      '/user/locations',
      data
    );
    return response.data.data;
  },

  /**
   * Update location
   */
  updateLocation: async (
    id: string,
    data: { name?: string; isPrimary?: boolean }
  ): Promise<Location> => {
    const response = await api.put<{ status: string; data: Location }>(
      `/user/locations/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete location
   */
  deleteLocation: async (id: string): Promise<void> => {
    await api.delete(`/user/locations/${id}`);
  },
};
