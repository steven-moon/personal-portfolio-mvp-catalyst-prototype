import { HomePage } from '../data/homeData';

/**
 * Get the home page content
 * @returns Promise containing the home page content
 */
export const getHomeContent = async (): Promise<HomePage> => {
  // In a real implementation, this would call a backend API
  const response = await fetch('/api/home');
  
  if (!response.ok) {
    throw new Error('Failed to fetch home data');
  }
  
  return response.json();
};

/**
 * Update the home page content
 * @param updatedContent The updated home page content
 * @returns Promise containing the updated home page content
 */
export const updateHomeContent = async (updatedContent: HomePage): Promise<HomePage> => {
  // In a real implementation, this would call a backend API
  const response = await fetch('/api/home', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedContent),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update home data');
  }
  
  return response.json();
};

/**
 * Upload a profile image for the home page
 * @param image The image file to upload
 * @returns Promise containing the URL of the uploaded image
 */
export const uploadProfileImage = async (image: File): Promise<string> => {
  // In a real implementation, this would upload the image to a storage service
  const formData = new FormData();
  formData.append('image', image);
  
  const response = await fetch('/api/home/profile-image', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload profile image');
  }
  
  const data = await response.json();
  return data.imageUrl;
}; 