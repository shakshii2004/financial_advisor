import api, { initCsrf } from '../lib/api';
import type { User, LoginCredentials, RegisterCredentials } from '../types/schema';

/**
 * Authentication Service
 * 
 * Handles all identity and access management calls to the Laravel backend.
 */
export const authService = {
  /**
    * Initializes the CSRF protection for Laravel Sanctum.
    * This must be called before any state-changing requests (Login, Register).
    */
  async getCsrfCookie(): Promise<void> {
    await initCsrf();
  },

  /**
    * Authenticates a user and starts a session.
    */
  async login(credentials: LoginCredentials): Promise<User> {
    await this.getCsrfCookie();
    const response = await api.post('/auth/login', credentials);
    console.log('AuthService Login Response:', response.data);
    return response.data.data;
  },

  /**
    * Registers a new user account.
    */
  async register(credentials: RegisterCredentials): Promise<User> {
    await this.getCsrfCookie();
    const response = await api.post('/auth/register', credentials);
    return response.data.data;
  },

  /**
    * Logs out the current user and destroys the session.
    */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  /**
    * Fetches the currently authenticated user's profile.
    */
  async getMe(): Promise<User | null> {
    try {
      const response = await api.get('/auth/me');
      console.log('AuthService getMe Response:', response.data);
      return response.data.data;
    } catch (error) {
      return null;
    }
  },
};
