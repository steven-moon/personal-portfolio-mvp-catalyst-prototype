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
  
  // Detailed logging for POST/PUT requests
  if (options.method === 'POST' || options.method === 'PUT') {
    console.log(`🔵 API FETCH - ${options.method} request to ${url}`);
    if (options.body) {
      try {
        const bodyObj = JSON.parse(options.body as string);
        console.log(`🔵 API FETCH - Request body:`, bodyObj);
      } catch (e) {
        console.error(`🔵 API FETCH - Failed to parse request body:`, options.body);
      }
    } else {
      console.warn(`🔵 API FETCH - ${options.method} request has no body!`);
    }
  }
  
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
      
      const fullUrl = getApiUrl(url);
      
      if (options.method === 'POST' || options.method === 'PUT') {
        console.log(`🔵 API FETCH - Final URL for ${options.method}:`, fullUrl);
        console.log(`🔵 API FETCH - Headers for ${options.method}:`, headers);
        console.log(`🔵 API FETCH - BEFORE fetch call for ${options.method}`);
      }
      
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal: controller.signal,
      });
      
      if (options.method === 'POST' || options.method === 'PUT') {
        console.log(`🔵 API FETCH - AFTER fetch call for ${options.method} - Status: ${response.status}`);
      }
      
      // Clear the timeout
      clearTimeout(timeoutId);

      if (options.method === 'POST' || options.method === 'PUT') {
        console.log(`🔵 API FETCH - Response status: ${response.status} for ${options.method} ${url}`);
      }

      if (!response.ok) {
        if (options.method === 'POST' || options.method === 'PUT') {
          console.error(`🔵 API FETCH - Error response: ${response.status} for ${options.method}`);
        }
        
        // Handle 401 Unauthorized - DON'T automatically clear auth data
        // This could cause unnecessary redirects on page refresh
        if (response.status === 401) {
          console.warn('Received 401 unauthorized response');
          // We won't automatically clear auth data here
          // Let the auth context handle authentication state
        }
        
        // Try to parse error response as JSON, but handle cases where it's not JSON
        let errorData: { message?: string } = {};
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            errorData = { message: await response.text() };
          }
        } catch (e) {
          errorData = { message: `Server error: ${response.status}` };
        }
        
        throw new Error(
          errorData.message || `API request failed with status ${response.status}`
        );
      }

      // For successful responses, check if there's content to parse
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        if (options.method === 'POST' || options.method === 'PUT') {
          console.log(`🔵 API FETCH - Parsing JSON response for ${options.method}`);
        }
        const result = await response.json();
        if (options.method === 'POST' || options.method === 'PUT') {
          console.log(`🔵 API FETCH - Parsed JSON result for ${options.method}:`, result);
        }
        return result;
      } else {
        // For empty responses (common with DELETE operations)
        // or non-JSON responses, return an empty object or the text
        const text = await response.text();
        if (options.method === 'POST' || options.method === 'PUT') {
          console.log(`🔵 API FETCH - Non-JSON response text for ${options.method}:`, text);
        }
        if (!text) {
          return {} as T;
        }
        try {
          return JSON.parse(text) as T;
        } catch (e) {
          return text as unknown as T;
        }
      }
    } catch (error) {
      if (options.method === 'POST' || options.method === 'PUT') {
        console.error(`🔵 API FETCH - Error during ${options.method} fetch:`, error);
      }
      
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
export async function apiPost<T, U = any>(endpoint: string, data: U, authenticated: boolean = true): Promise<T> {
  console.log(`🟣 API POST - Called for endpoint: ${endpoint}`);
  console.log(`🟣 API POST - Data to send:`, data);
  try {
    console.log(`🟣 API POST - BEFORE calling fetchWithError`);
    const result = await fetchWithError<T>(
      endpoint, 
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      authenticated
    );
    console.log(`🟣 API POST - AFTER calling fetchWithError - Success`);
    console.log(`🟣 API POST - Result:`, result);
    return result;
  } catch (error) {
    console.error(`🟣 API POST - ERROR:`, error);
    console.error(`🟣 API POST - ERROR details:`, {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

/**
 * Generic PUT request
 */
export async function apiPut<T, U = any>(endpoint: string, data: U, authenticated: boolean = true): Promise<T> {
  console.log(`apiPut: Sending PUT to ${endpoint}`);
  try {
    const result = await fetchWithError<T>(
      endpoint, 
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      authenticated
    );
    console.log(`apiPut: Successful response from ${endpoint}`);
    return result;
  } catch (error) {
    console.error(`apiPut: Error sending PUT to ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Generic DELETE request
 */
export async function apiDelete<T>(endpoint: string, authenticated: boolean = true): Promise<T> {
  return fetchWithError<T>(endpoint, { method: 'DELETE' }, authenticated);
} 