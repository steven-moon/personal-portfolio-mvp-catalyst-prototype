import { User, UserRole } from '@/types/user';

// Default admin user
const defaultUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: UserRole.ADMIN,
    createdAt: new Date('2023-01-01').toISOString(),
    lastLogin: new Date().toISOString(),
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all users from localStorage or return default users if none exist
 */
export const getMockUsers = async (): Promise<User[]> => {
  await delay(500); // Simulate network delay
  
  try {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
    
    // If no users in localStorage, save and return default users
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    return defaultUsers;
  } catch (error) {
    console.error('Error getting users:', error);
    return defaultUsers;
  }
};

/**
 * Save users to localStorage
 */
export const saveMockUsers = async (users: User[]): Promise<boolean> => {
  await delay(600); // Simulate network delay
  
  try {
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
};

/**
 * Add a new user
 */
export const addMockUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User | null> => {
  await delay(700); // Simulate network delay
  
  try {
    const users = await getMockUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
      return null; // Email already exists
    }
    
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedUsers = [...users, newUser];
    await saveMockUsers(updatedUsers);
    
    return newUser;
  } catch (error) {
    console.error('Error adding user:', error);
    return null;
  }
};

/**
 * Update an existing user
 */
export const updateMockUser = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  await delay(600); // Simulate network delay
  
  try {
    const users = await getMockUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return null; // User not found
    }
    
    // If updating email, check if it already exists for another user
    if (updates.email && users.some(u => u.email === updates.email && u.id !== userId)) {
      return null; // Email already exists for another user
    }
    
    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    
    await saveMockUsers(users);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

/**
 * Delete a user
 */
export const deleteMockUser = async (userId: string): Promise<boolean> => {
  await delay(700); // Simulate network delay
  
  try {
    const users = await getMockUsers();
    
    // Don't allow deleting the last admin
    const adminUsers = users.filter(u => u.role === UserRole.ADMIN);
    const targetUser = users.find(u => u.id === userId);
    
    if (targetUser?.role === UserRole.ADMIN && adminUsers.length <= 1) {
      return false; // Cannot delete the last admin
    }
    
    const updatedUsers = users.filter(u => u.id !== userId);
    await saveMockUsers(updatedUsers);
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

/**
 * Reset users to default
 */
export const resetMockUsers = async (): Promise<boolean> => {
  await delay(500); // Simulate network delay
  
  try {
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    return true;
  } catch (error) {
    console.error('Error resetting users:', error);
    return false;
  }
}; 