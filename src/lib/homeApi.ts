import { HomePage } from '../data/homeData';
import { apiGet, apiPut, apiPost } from './api';
import { API_CONFIG } from '../config';
import { storeProfileImage } from './localStorageUtils';

/**
 * Get the home page content
 * @returns Promise containing the home page content
 */
export const getHomeContent = async (): Promise<HomePage> => {
  console.log('homeApi: getHomeContent called');
  try {
    // First get the main home page data
    const homeData = await apiGet<any>('/api/home');
    console.log('homeApi: apiGet response:', homeData);
    
    // Ensure the response has the expected structure
    let formattedData: HomePage = {
      hero: {
        title: '',
        subtitle: '',
        profession: '',
        services: []
      }
    };
    
    // If the API returned data directly without a 'hero' wrapper
    if (homeData && !homeData.hero) {
      console.log('homeApi: Restructuring API response to match expected format');
      formattedData.hero = {
        title: homeData.title || '',
        subtitle: homeData.subtitle || '',
        profession: homeData.profession || '',
        profileImage: homeData.profileImage,
        services: Array.isArray(homeData.services) ? homeData.services : []
      };
    } else if (homeData && homeData.hero) {
      // If the data already has the hero structure, use it
      formattedData = homeData;
      
      // Ensure services is properly initialized
      if (!formattedData.hero.services) {
        console.log('homeApi: Services not found in response, initializing empty array');
        formattedData.hero.services = [];
      } else {
        console.log(`homeApi: Services found in response, count: ${formattedData.hero.services.length}`);
      }
    }
    
    // If we're hitting the real backend, we need to fetch services separately
    // if they're not included in the main response
    if (homeData && 'id' in homeData && (!formattedData.hero.services || formattedData.hero.services.length === 0)) {
      console.log('homeApi: Attempting to fetch services separately');
      try {
        const services = await getServices();
        console.log('homeApi: Services fetched separately:', services);
        
        // Add the services to the formatted data
        if (Array.isArray(services) && services.length > 0) {
          formattedData.hero.services = services;
          console.log(`homeApi: Added ${services.length} services from separate call`);
        }
      } catch (servicesError) {
        console.error('homeApi: Error fetching services:', servicesError);
        // Initialize with empty array if services couldn't be fetched
        if (!formattedData.hero.services) {
          formattedData.hero.services = [];
        }
      }
    }
    
    // Log the final structure we're returning
    console.log('homeApi: Final home data structure:', formattedData);
    if (formattedData.hero && formattedData.hero.services) {
      console.log('homeApi: Services count in response:', formattedData.hero.services.length);
    }
    
    return formattedData;
  } catch (error) {
    console.error('homeApi: Error in getHomeContent:', error);
    // Return a default structure on error to prevent undefined errors
    return {
      hero: {
        title: 'Error loading content',
        subtitle: 'Please try again later',
        profession: '',
        services: []
      }
    };
  }
};

/**
 * Update the home page content
 * @param updatedContent The updated home page content
 * @returns Promise containing the updated home page content
 */
export const updateHomeContent = async (updatedContent: HomePage): Promise<HomePage> => {
  console.log('homeApi: updateHomeContent called with:', updatedContent);
  
  try {
    // First update the main home content
    const result = await apiPut<HomePage, HomePage>('/api/home/1', updatedContent, true);
    
    // Now handle services separately if we're using the real API
    // When the result has an ID, it means we're working with the real backend
    if (result && 'id' in result) {
      console.log('homeApi: Updating services separately for real API');
      
      // If there are services to update
      if (updatedContent.hero.services && updatedContent.hero.services.length > 0) {
        // Clear existing services first (simplest approach to sync)
        // In a real implementation, you might want to do a more sophisticated sync
        // that updates, creates, or deletes individual services as needed
        
        // Get existing services to compare
        const existingServices = await getServices();
        console.log('homeApi: Existing services:', existingServices);
        
        // For each service in updatedContent
        for (const service of updatedContent.hero.services) {
          // Check if this service exists (by ID)
          const existingService = existingServices.find(s => s.id === service.id);
          
          if (existingService) {
            // Update existing service
            console.log('homeApi: Updating existing service:', service.id);
            await updateService(service.id, service);
          } else {
            // Create new service
            console.log('homeApi: Creating new service');
            const { id, ...serviceData } = service;
            await createService(serviceData);
          }
        }
        
        // Delete any services that are no longer in the updated content
        for (const existingService of existingServices) {
          if (!updatedContent.hero.services.some(s => s.id === existingService.id)) {
            console.log('homeApi: Deleting removed service:', existingService.id);
            await deleteService(existingService.id);
          }
        }
      }
    }
    
    // Fetch the updated content to return the latest state
    return getHomeContent();
  } catch (error) {
    console.error('homeApi: Error in updateHomeContent:', error);
    throw error;
  }
};

/**
 * Upload a profile image for the home page
 * @param image The image file to upload
 * @returns Promise containing the URL of the uploaded image
 */
export const uploadProfileImage = async (image: File): Promise<string> => {
  console.log("homeApi: uploadProfileImage called with file:", image.name, image.size);
  
  try {
    // Since the backend endpoint doesn't exist yet, we'll use local storage
    // This is a temporary solution until the backend is implemented
    console.log("homeApi: Using local storage for image upload");
    const localImageUrl = await storeProfileImage(image);
    console.log("homeApi: Image stored successfully at:", localImageUrl);
    
    // In a real implementation, we would upload to the server:
    // const formData = new FormData();
    // formData.append('image', image);
    // const response = await fetch(`${API_CONFIG.BASE_URL}/api/home/profile-image`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN)}`
    //   },
    //   body: formData,
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Failed to upload profile image');
    // }
    // 
    // const data = await response.json();
    // return data.imageUrl;
    
    return localImageUrl;
  } catch (error) {
    console.error("homeApi: Error uploading image:", error);
    throw new Error('Failed to upload profile image');
  }
};

/**
 * Get all services
 * @returns Promise containing an array of services
 */
export const getServices = async (): Promise<HomePage['hero']['services']> => {
  return apiGet<HomePage['hero']['services']>('/api/home/1/services');
};

/**
 * Create a new service
 * @param service The service to create
 * @returns Promise containing the created service
 */
export const createService = async (service: Omit<HomePage['hero']['services'][0], 'id'>): Promise<HomePage['hero']['services'][0]> => {
  return apiPost<HomePage['hero']['services'][0], Omit<HomePage['hero']['services'][0], 'id'>>('/api/home/1/services', service, true);
};

/**
 * Update a service
 * @param serviceId The ID of the service to update
 * @param service The updated service data
 * @returns Promise containing the updated service
 */
export const updateService = async (serviceId: string, service: Partial<HomePage['hero']['services'][0]>): Promise<HomePage['hero']['services'][0]> => {
  return apiPut<HomePage['hero']['services'][0], Partial<HomePage['hero']['services'][0]>>(`/api/home/1/services/${serviceId}`, service, true);
};

/**
 * Delete a service
 * @param serviceId The ID of the service to delete
 * @returns Promise containing the deletion result
 */
export const deleteService = async (serviceId: string): Promise<{ success: boolean }> => {
  return apiGet<{ success: boolean }>(`/api/home/1/services/${serviceId}/delete`, true);
}; 