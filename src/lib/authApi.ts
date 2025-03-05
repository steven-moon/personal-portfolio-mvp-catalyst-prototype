import { apiPost } from './api';

// Define interfaces for auth requests and responses
export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  token: string;
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignInResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  token: string;
}

/**
 * Create a new user account
 * @param userData The user data for signup
 * @returns Promise with signup response
 */
export async function signUp(userData: SignUpRequest): Promise<SignUpResponse> {
  return apiPost<SignUpResponse, SignUpRequest>('/api/auth/signup', userData);
}

/**
 * Sign in to an existing account
 * @param credentials Login credentials
 * @returns Promise with signin response
 */
export async function signIn(credentials: SignInRequest): Promise<SignInResponse> {
  return apiPost<SignInResponse, SignInRequest>('/api/auth/signin', credentials);
} 