import axios from 'axios';
import { config } from './config';

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  // withCredentials removed - not needed without cookie-based auth
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error types
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      // Network error or CORS issue
      console.error('Network error or CORS issue:', {
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        }
      });
      
      // Enhance error message for better debugging
      error.message = `Network error: Cannot connect to API at ${config.apiUrl}. This might be a CORS issue or the API is not accessible.`;
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
