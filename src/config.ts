/**
 * Application configuration settings
 */

// API configuration
export const API_CONFIG = {
  // Base API URL
  BASE_URL: 'http://localhost:3000',
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Maximum number of retry attempts for failed requests
  MAX_RETRIES: 3,
  
  // Delay between retry attempts in milliseconds
  RETRY_DELAY: 1000,
  
  // Storage keys for authentication data
  STORAGE_KEYS: {
    TOKEN: 'auth_token',
    USER: 'auth_user',
  }
};

/**
 * Helper function to determine if we're in development mode
 */
export const isDevelopment = (): boolean => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
};

/**
 * Get the full API URL for a given endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  // Make sure endpoint starts with a slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${normalizedEndpoint}`;
}; 