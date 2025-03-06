/**
 * Application-wide constants
 */

// Default images
export const DEFAULT_IMAGE = '/images/default-placeholder.jpg';
export const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&auto=format";

// API endpoints
export const API_BASE_URL = '/api';
export const API_TIMEOUT = 10000; // 10 seconds

// Local storage keys
export const LOCAL_STORAGE_PREFIX = 'portfolio_';
export const TOKEN_KEY = `${LOCAL_STORAGE_PREFIX}token`;
export const USER_KEY = `${LOCAL_STORAGE_PREFIX}user`;

// Pagination
export const ITEMS_PER_PAGE = 10;

// Animation durations
export const PAGE_TRANSITION_DURATION = 300; // ms 

// Storage keys
export const STORAGE_KEYS = {
  IMAGES: 'portfolio_images',
  PROFILE_IMAGE: 'portfolio_profile_image',
  PROFILE_IMAGE_PATH: 'portfolio_profile_image_path',
  HOME_CONTENT: 'portfolio_home_content'
}; 