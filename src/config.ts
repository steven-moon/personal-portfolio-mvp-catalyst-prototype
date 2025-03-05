/**
 * Application configuration settings
 */

// API configuration
export const API_CONFIG = {
  // Base API URL - empty in development for proxy to work
  BASE_URL: '',
  
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
  // In development, use relative URLs to leverage Vite's proxy
  if (isDevelopment()) {
    // Make sure endpoint starts with a slash
    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  }
  
  // In production, use the full URL
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${normalizedEndpoint}`;
}; 