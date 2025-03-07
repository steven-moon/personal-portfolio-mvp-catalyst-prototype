import { ContactInfo } from '../data/contactData';
import { API_CONFIG } from '@/config';

/**
 * Helper function to get auth token from localStorage
 */
const getAuthToken = (): string | null => {
  try {
    const authToken = localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
    return authToken;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Get the contact page content
 * @returns Promise containing the contact page content
 */
export const getContactInfo = async (): Promise<ContactInfo> => {
  // In a real implementation, this would call a backend API
  const response = await fetch('/api/contact');
  
  if (!response.ok) {
    throw new Error('Failed to fetch contact data');
  }
  
  return response.json();
};

/**
 * Update the contact page content
 * @param updatedContact The updated contact page content
 * @returns Promise containing the updated contact page content
 */
export const updateContactInfo = async (updatedContact: ContactInfo): Promise<ContactInfo> => {
  const token = getAuthToken();
  
  // In a real implementation, this would call a backend API
  const response = await fetch('/api/contact', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(updatedContact),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update contact data');
  }
  
  return response.json();
};

/**
 * Interface for the contact form data
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Interface for a contact message
 */
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Submit a contact form message
 * @param formData The contact form data
 * @returns Promise containing the result of the submission
 */
export const submitContactMessage = async (formData: ContactFormData): Promise<{ success: boolean; message: string; id?: number }> => {
  const response = await fetch('/api/contact/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to submit contact message');
  }
  
  return response.json();
};

/**
 * Get all contact messages
 * @returns Promise containing an array of contact messages
 */
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required to access messages');
  }
  
  const response = await fetch('/api/contact/messages', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch contact messages');
  }
  
  return response.json();
};

/**
 * Get a specific contact message by ID
 * @param id The ID of the contact message to retrieve
 * @returns Promise containing the contact message
 */
export const getContactMessageById = async (id: number): Promise<ContactMessage> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required to access message details');
  }
  
  const response = await fetch(`/api/contact/messages/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch contact message');
  }
  
  return response.json();
};

/**
 * Update a contact message (e.g., mark as read)
 * @param id The ID of the contact message to update
 * @param updates The updates to apply to the message
 * @returns Promise containing the updated contact message
 */
export const updateContactMessage = async (id: number, updates: { isRead?: boolean }): Promise<ContactMessage> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required to update message');
  }
  
  const response = await fetch(`/api/contact/messages/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update contact message');
  }
  
  return response.json();
}; 