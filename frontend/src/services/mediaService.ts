import api from '../lib/api';

export const mediaService = {
  /**
   * Upload a logo for a startup
   */
  async uploadLogo(startupId: number, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('startup_id', startupId.toString());
    formData.append('logo', file);

    const response = await api.post('/media/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.logo_url;
  }
};
