/**
 * User role enum
 */
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
}

/**
 * User creation data interface
 */
export interface UserCreateData {
  email: string;
  name: string;
  role: UserRole;
  password?: string; // Optional for mock implementation
}

/**
 * User update data interface
 */
export interface UserUpdateData {
  email?: string;
  name?: string;
  role?: UserRole;
  password?: string; // Optional for mock implementation
} 