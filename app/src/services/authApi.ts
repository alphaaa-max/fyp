/**
 * Authentication API endpoints
 */
import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/user.types';

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<{ status: string; data: AuthResponse }>(
      '/auth/register',
      data
    );
    return response.data.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<{ status: string; data: AuthResponse }>(
      '/auth/login',
      data
    );
    return response.data.data;
  },

  /**
   * Get current user profile
   */
  getMe: async (): Promise<User> => {
    const response = await api.get<{ status: string; data: User }>('/auth/me');
    return response.data.data;
  },
};
