import api from '../lib/api';
import type { Startup } from '../types/schema';

/**
 * Startup Service
 * 
 * Manages all startup-related operations: listing, creating, and updating.
 */
export const startupService = {
  /**
   * Fetches all startups the user has access to.
   * Founders will usually get 1, Investors will get their portfolio.
   */
  async getAll(): Promise<Startup[]> {
    const response = await api.get('/startups');
    return response.data.data;
  },

  /**
   * Creates a new startup profile.
   */
  async create(data: Partial<Startup>): Promise<Startup> {
    const response = await api.post('/startups', data);
    return response.data.data;
  },

  /**
   * Fetches a single startup by ID.
   */
  async getById(id: number): Promise<Startup> {
    const response = await api.get(`/startups/${id}`);
    return response.data.data;
  },

  /**
   * Updates an existing startup profile.
   */
  async update(id: number, data: Partial<Startup>): Promise<Startup> {
    const response = await api.put(`/startups/${id}`, data);
    return response.data.data;
  },

  /**
   * Deletes a startup profile.
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/startups/${id}`);
  },
};
