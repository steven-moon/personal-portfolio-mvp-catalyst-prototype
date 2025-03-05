import { AboutMeData } from '../data/aboutData';
import { apiGet, apiPut } from './api';

/**
 * Get the about page content
 * @returns Promise containing the about page content
 */
export const getAboutContent = async (): Promise<AboutMeData> => {
  // Use the public endpoint that doesn't require authentication
  // With the proxy configured in vite.config.ts, this will be forwarded to the backend
  const url = '/api/about/public';
  console.log('Fetching about data from:', url);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch about data: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching about data:', error);
    throw new Error('Failed to fetch about data');
  }
};

/**
 * Update the about page content
 * @param updatedContent The updated about page content
 * @returns Promise containing the updated about page content
 */
export const updateAboutContent = async (updatedContent: AboutMeData): Promise<AboutMeData> => {
  console.log('aboutApi: updateAboutContent called with:', updatedContent);
  
  try {
    // Create a deep copy of the content to avoid modifying the original
    const contentToSend = JSON.parse(JSON.stringify(updatedContent));
    
    // Convert story array to a string if it's an array
    if (Array.isArray(contentToSend.story)) {
      contentToSend.story = contentToSend.story.join('\n\n');
      console.log('Converted story array to string:', contentToSend.story);
    }
    
    // Use the apiPut helper which handles authentication
    const result = await apiPut<AboutMeData, AboutMeData>('/api/about', contentToSend, true);
    return result;
  } catch (error) {
    console.error('Error updating about data:', error);
    throw new Error('Failed to update about data');
  }
}; 