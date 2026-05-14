// API client configuration
import axios from 'axios';

// Use environment variable for production, fallback to /api for local proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const ROOT_URL = import.meta.env.VITE_ROOT_URL || '';

console.log('API Client initialized with Base URL:', API_BASE_URL);
console.log('Root URL for CSRF:', ROOT_URL || '(current origin)');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * Initialize CSRF protection for Sanctum
 */
export const initCsrf = async () => {
    console.log('Initializing CSRF protection...');
    try {
      // Sanctum expects this at /sanctum/csrf-cookie, not /api/sanctum/csrf-cookie
      await apiClient.get('/sanctum/csrf-cookie', {
        baseURL: window.location.origin
      });
      console.log('CSRF initialization successful');
    } catch (error) {
      console.error('CSRF initialization failed:', error);
      throw error;
    }
  };

// Add request interceptor to handle auth errors
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Handle 419 (CSRF Token Mismatch) - retry once after fetching cookie
    if (error.response?.status === 419 && !originalRequest._retry) {
      console.warn('CSRF token mismatch detected. Attempting to refresh cookie and retry...');
      originalRequest._retry = true;
      try {
        await initCsrf();
        console.log('Retrying original request after CSRF refresh...');
        return apiClient(originalRequest);
      } catch (csrfError) {
        console.error('Retry failed after CSRF refresh');
        return Promise.reject(csrfError);
      }
    }

    if (error.response?.status === 401) {
      // Don't redirect if we're already on the login page or checking current user status
      if (originalRequest.url?.includes('/auth/me') || window.location.pathname === '/login') {
        return Promise.reject(error);
      }
      
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
