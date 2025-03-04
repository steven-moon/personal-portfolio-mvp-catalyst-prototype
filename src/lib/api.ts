// Base API handling functions
// Define API URL - in a real app, this would come from environment variables
const API_URL = 'https://api.example.com';

/**
 * Generic fetch function with error handling
 */
async function fetchWithError<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API request failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
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