import { AboutMeData } from '../data/aboutData';

/**
 * Get the about page content
 * @returns Promise containing the about page content
 */
export const getAboutContent = async (): Promise<AboutMeData> => {
  // In a real implementation, this would call a backend API
  const response = await fetch('/api/about');
  
  if (!response.ok) {
    throw new Error('Failed to fetch about data');
  }
  
  return response.json();
};

/**
 * Update the about page content
 * @param updatedContent The updated about page content
 * @returns Promise containing the updated about page content
 */
export const updateAboutContent = async (updatedContent: AboutMeData): Promise<AboutMeData> => {
  // In a real implementation, this would call a backend API
  const response = await fetch('/api/about', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedContent),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update about data');
  }
  
  return response.json();
}; 