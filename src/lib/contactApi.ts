import { ContactInfo } from '../data/contactData';

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
  // In a real implementation, this would call a backend API
  const response = await fetch('/api/contact', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedContact),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update contact data');
  }
  
  return response.json();
}; 