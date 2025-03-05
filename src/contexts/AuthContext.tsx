import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signIn, signUp, SignInResponse, SignUpRequest } from '@/lib/authApi';
import { API_CONFIG } from '@/config';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage on initial load
    const storedToken = localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER);
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use the real API for login
      const response = await signIn({ username: email, password });
      
      // Store auth data
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(response.user));
      
      // Update state
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Use the signUp API function
      const userData: SignUpRequest = { username, email, password };
      const response = await signUp(userData);
      
      // Store auth data
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(response.user));
      
      // Update state
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER);
    
    // Reset state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    token,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 