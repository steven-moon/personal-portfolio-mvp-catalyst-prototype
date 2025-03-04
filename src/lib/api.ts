// Base API handling functions
// Define API URL - in a real app, this would come from environment variables
const API_URL = 'https://api.example.com';

// Configuration
const API_CONFIG = {
  timeout: 10000, // 10 seconds
  maxRetries: 3,
  retryDelay: 1000, // 1 second
};

/**
 * Sleep function for implementing delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generic fetch function with error handling, timeout, and retry logic
 */
async function fetchWithError<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  let retries = 0;
  
  while (true) {
    try {
      // Create an AbortController for implementing timeouts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
      
      const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
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
      if (retries >= API_CONFIG.maxRetries || !isRetryable) {
        console.error('API request error:', error);
        throw error;
      }
      
      // Increment retries and wait before trying again
      retries++;
      console.log(`Retrying API request (${retries}/${API_CONFIG.maxRetries})...`);
      await sleep(API_CONFIG.retryDelay * retries); // Exponential backoff
    }
  }
}

/**
 * Generic GET request
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return fetchWithError<T>(endpoint, { method: 'GET' });
}

/**
 * Generic POST request
 */
export async function apiPost<T, U = any>(endpoint: string, data: U): Promise<T> {
  return fetchWithError<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Generic PUT request
 */
export async function apiPut<T, U = any>(endpoint: string, data: U): Promise<T> {
  return fetchWithError<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Generic DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return fetchWithError<T>(endpoint, { method: 'DELETE' });
} 