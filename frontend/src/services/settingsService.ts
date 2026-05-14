import api from '../lib/api';

export const settingsService = {
  /**
   * Update User Profile (Name)
   */
  async updateProfile(data: { name: string }): Promise<void> {
    await api.put('/settings/profile', data);
  },

  /**
   * Update User Password
   */
  async updatePassword(data: { current_password: string; new_password: string; new_password_confirmation: string }): Promise<void> {
    await api.put('/settings/password', data);
  }
};
