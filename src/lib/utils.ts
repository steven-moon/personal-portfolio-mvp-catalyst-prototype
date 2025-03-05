import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if the stored JWT token is valid and not expired
 */
export function isValidToken(token: string): boolean {
  if (!token) {
    return false;
  }
  
  try {
    // JWT tokens are base64 encoded and have 3 parts separated by dots
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }
    
    // Decode the payload (middle part)
    const payload = JSON.parse(atob(tokenParts[1]));
    
    // Check if token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}
