import { API_CONFIG, getApiUrl } from '../config';

// Configuration
const REQUEST_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  maxRetries: API_CONFIG.MAX_RETRIES,
  retryDelay: API_CONFIG.RETRY_DELAY,
};

/**
 * Sleep function for implementing delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get the authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
};

/**
 * Generic fetch function with error handling, timeout, and retry logic
 */
async function fetchWithError<T>(
  url: string, 
  options: RequestInit = {},
  authenticated: boolean = false
): Promise<T> {
  let retries = 0;
  
  while (true) {
    try {
      // Create an AbortController for implementing timeouts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_CONFIG.timeout);
      
      // Prepare headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      // Add authorization header if authenticated request
      if (authenticated) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(getApiUrl(url), {
        ...options,
        headers,
        signal: controller.signal,
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle 401 Unauthorized by logging out
        if (response.status === 401) {
          // Clear authentication data
          localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN);
          localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER);
          // Redirect to login page if needed
          // window.location.href = '/login';
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API request failed with status ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      // Determine if we should retry
      const isTimeoutError = error instanceof Error && error.name === 'AbortError';
      const isNetworkError = error instanceof TypeError && error.message.includes('network');
      const isRetryable = isTimeoutError || isNetworkError;
      
      // If we've reached max retries or the error isn't retryable, throw
      if (retries >= REQUEST_CONFIG.maxRetries || !isRetryable) {
        console.error('API request error:', error);
        throw error;
      }
      
      // Increment retries and wait before trying again
      retries++;
      console.log(`Retrying API request (${retries}/${REQUEST_CONFIG.maxRetries})...`);
      await sleep(REQUEST_CONFIG.retryDelay * retries); // Exponential backoff
    }
  }
}

/**
 * Generic GET request
 */
export async function apiGet<T>(endpoint: string, authenticated: boolean = false): Promise<T> {
  return fetchWithError<T>(endpoint, { method: 'GET' }, authenticated);
}

/**
 * Generic POST request
 */
export async function apiPost<T, U = any>(endpoint: string, data: U, authenticated: boolean = false): Promise<T> {
  return fetchWithError<T>(
    endpoint, 
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    authenticated
  );
}

/**
 * Generic PUT request
 */
export async function apiPut<T, U = any>(endpoint: string, data: U, authenticated: boolean = true): Promise<T> {
  return fetchWithError<T>(
    endpoint, 
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    authenticated
  );
}

/**
 * Generic DELETE request
 */
export async function apiDelete<T>(endpoint: string, authenticated: boolean = true): Promise<T> {
  return fetchWithError<T>(endpoint, { method: 'DELETE' }, authenticated);
} 