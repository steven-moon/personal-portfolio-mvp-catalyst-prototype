import { mockBlogApi, mockProjectApi, mockHomeApi, mockContactApi, mockAboutApi } from './mockApi';
import * as blogApi from './blogApi';
import * as projectApi from './projectApi';
import * as homeApi from './homeApi';
import * as contactApi from './contactApi';
import * as aboutApi from './aboutApi';
import { storeImageLocally, STORAGE_KEYS } from './localStorageUtils';

// Read environment variable for using mock API
// If not set, default to true
const ENV_USE_MOCK_API = import.meta.env.VITE_USE_MOCK_DATA !== undefined
  ? import.meta.env.VITE_USE_MOCK_DATA === 'true'
  : true;

// API service configuration state
let useMockApi = ENV_USE_MOCK_API;

// Log the current API mode on startup
console.log(`API Service initialized. Using ${useMockApi ? 'MOCK' : 'REAL'} API`);

// Add a function to force the use of real API for testing
const forceRealApi = () => {
  useMockApi = false;
  console.log('FORCED API to use REAL implementation');
  return useMockApi;
};

// Add a helper function for safe error logging
const logApiError = (service: string, method: string, error: any) => {
  console.error(`API Error in ${service}.${method}:`, error);
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    name: error.name
  });
};

/**
 * User API - Exports all user related API functions
 */
export const UserService = {
  getAllUsers: async () => {
    // For now, we'll just return the current user from localStorage
    // In a real app, this would call a real API endpoint
    try {
      const userData = localStorage.getItem('auth_user');
      if (userData) {
        const currentUser = JSON.parse(userData);
        return [{
          id: currentUser.id,
          username: currentUser.username || 'Current User',
          email: currentUser.email || '',
          role: currentUser.role || 'user'
        }];
      }
      // Return a default user if no user is logged in
      return [{
        id: 1,
        username: 'Default User',
        email: 'user@example.com',
        role: 'user'
      }];
    } catch (err) {
      console.error('Error getting users:', err);
      return [];
    }
  }
};

/**
 * BlogPost API - Exports all blog post related API functions
 */
export const BlogService = {
  getAllBlogPosts: async () => {
    return useMockApi ? mockBlogApi.getAllBlogPosts() : blogApi.getAllBlogPosts();
  },
  getBlogPostById: async (id: number) => {
    return useMockApi ? mockBlogApi.getBlogPostById(id) : blogApi.getBlogPostById(id);
  },
  createBlogPost: async (blogPost: any) => {
    console.log('🟠 BLOG SERVICE - createBlogPost called with:', blogPost);
    try {
      // Use regular API without forcing real API
      const isMockApi = useMockApi;
      console.log(`🟠 BLOG SERVICE - Using ${isMockApi ? 'MOCK' : 'REAL'} API for blog post creation`);
      
      let result;
      if (isMockApi) {
        console.log('🟠 BLOG SERVICE - BEFORE calling mockBlogApi.createBlogPost');
        result = await mockBlogApi.createBlogPost(blogPost);
        console.log('🟠 BLOG SERVICE - AFTER calling mockBlogApi.createBlogPost - success');
      } else {
        console.log('🟠 BLOG SERVICE - BEFORE calling blogApi.createBlogPost');
        result = await blogApi.createBlogPost(blogPost);
        console.log('🟠 BLOG SERVICE - AFTER calling blogApi.createBlogPost - success');
      }
      
      console.log('🟠 BLOG SERVICE - Blog post created successfully:', result);
      return result;
    } catch (error) {
      console.error('🟠 BLOG SERVICE - ERROR in createBlogPost:', error);
      console.error('🟠 BLOG SERVICE - ERROR details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },
  updateBlogPost: async (id: number, blogPostUpdate: any) => {
    console.log(`Updating blog post ${id}`);
    try {
      if (useMockApi) {
        console.log('Using mock API for blog post update');
        const result = await mockBlogApi.updateBlogPost(id, blogPostUpdate);
        console.log('Blog post updated with mock API');
        return result;
      } else {
        console.log('Using real API for blog post update');
        const result = await blogApi.updateBlogPost(id, blogPostUpdate);
        console.log('Blog post updated with real API');
        return result;
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },
  deleteBlogPost: async (id: number) => {
    return useMockApi ? mockBlogApi.deleteBlogPost(id) : blogApi.deleteBlogPost(id);
  },
  searchBlogPosts: async (query: string) => {
    return useMockApi ? mockBlogApi.searchBlogPosts(query) : blogApi.searchBlogPosts(query);
  },
  getBlogPostsByCategory: async (categoryId: number) => {
    return useMockApi ? mockBlogApi.getBlogPostsByCategory(categoryId) : blogApi.getBlogPostsByCategory(categoryId);
  },
  getAllCategories: async () => {
    return useMockApi ? mockBlogApi.getAllCategories() : blogApi.getAllCategories();
  },
  getBlogPostsByAuthor: async (authorId: number) => {
    return useMockApi ? mockBlogApi.getBlogPostsByAuthor(authorId) : blogApi.getBlogPostsByAuthor(authorId);
  },
  uploadBlogImage: async (image: File) => {
    return useMockApi ? 
      // If mock API, store locally and return path
      storeImageLocally(image, STORAGE_KEYS.IMAGES).then(path => path) : 
      // Otherwise use real API
      blogApi.uploadBlogImage(image);
  }
};

/**
 * Project API - Exports all project related API functions
 */
export const ProjectService = {
  getAllProjects: async () => {
    return useMockApi ? mockProjectApi.getAllProjects() : projectApi.getAllProjects();
  },
  getProjectById: async (id: number) => {
    return useMockApi ? mockProjectApi.getProjectById(id) : projectApi.getProjectById(id);
  },
  createProject: async (project: any) => {
    return useMockApi ? mockProjectApi.createProject(project) : projectApi.createProject(project);
  },
  updateProject: async (id: number, projectUpdate: any) => {
    return useMockApi ? mockProjectApi.updateProject(id, projectUpdate) : projectApi.updateProject(id, projectUpdate);
  },
  deleteProject: async (id: number) => {
    return useMockApi ? mockProjectApi.deleteProject(id) : projectApi.deleteProject(id);
  },
  getProjectsByTag: async (tag: string) => {
    return useMockApi ? mockProjectApi.getProjectsByTag(tag) : projectApi.getProjectsByTag(tag);
  },
  uploadProjectImages: async (projectId: number, images: File[]) => {
    return useMockApi ? mockProjectApi.uploadProjectImages(projectId, images) : projectApi.uploadProjectImages(projectId, images);
  },
};

/**
 * Home API - Exports all home page related API functions
 */
export const HomeService = {
  getHomeContent: async () => {
    console.log('HomeService: getHomeContent called, using', useMockApi ? 'mock' : 'real', 'API');
    try {
      let result;
      if (useMockApi) {
        console.log('HomeService: Calling mock API getHomeContent');
        result = await mockHomeApi.getHomeContent();
        console.log('HomeService: Mock API returned:', result);
      } else {
        console.log('HomeService: Calling real API getHomeContent');
        try {
          result = await homeApi.getHomeContent();
          console.log('HomeService: Real API returned:', result);
        } catch (error) {
          console.log('HomeService: Real API failed, falling back to mock API');
          logApiError('HomeService', 'getHomeContent', error);
          // Fall back to mock API on error
          result = await mockHomeApi.getHomeContent();
          console.log('HomeService: Fallback to mock API returned:', result);
        }
      }
      
      // Check if the data has services property
      if (result && 'services' in result) {
        console.log('HomeService: Response has services property with', result.services?.length || 0, 'items');
      } else if (result && 'hero' in result && result.hero.services) {
        console.log('HomeService: Response has hero.services property with', result.hero.services.length, 'items');
      } else {
        console.log('HomeService: Response is missing services data');
      }
      
      return result;
    } catch (error) {
      logApiError('HomeService', 'getHomeContent', error);
      throw error;
    }
  },
  updateHomeContent: async (updatedContent: any) => {
    return useMockApi ? mockHomeApi.updateHomeContent(updatedContent) : homeApi.updateHomeContent(updatedContent);
  },
  uploadProfileImage: async (image: File) => {
    return useMockApi ? mockHomeApi.uploadProfileImage(image) : homeApi.uploadProfileImage(image);
  },
};

/**
 * Contact API - Exports all contact page related API functions
 */
export const ContactService = {
  getContactInfo: async () => {
    return useMockApi ? mockContactApi.getContactInfo() : contactApi.getContactInfo();
  },
  updateContactInfo: async (updatedContact: any) => {
    return useMockApi ? mockContactApi.updateContactInfo(updatedContact) : contactApi.updateContactInfo(updatedContact);
  },
};

/**
 * About API - Exports all about page related API functions
 */
export const AboutService = {
  getAboutContent: async () => {
    console.log('AboutService: getAboutContent called, using', useMockApi ? 'mock' : 'real', 'API');
    try {
      let result;
      if (useMockApi) {
        console.log('AboutService: Calling mock API getAboutContent');
        result = await mockAboutApi.getAboutContent();
        console.log('AboutService: Mock API returned:', result);
      } else {
        console.log('AboutService: Calling real API getAboutContent');
        try {
          result = await aboutApi.getAboutContent();
          console.log('AboutService: Real API returned:', result);
        } catch (error) {
          console.log('AboutService: Real API failed, falling back to mock API');
          logApiError('AboutService', 'getAboutContent', error);
          // Fall back to mock API on error
          result = await mockAboutApi.getAboutContent();
          console.log('AboutService: Fallback to mock API returned:', result);
        }
      }
      return result;
    } catch (error) {
      logApiError('AboutService', 'getAboutContent', error);
      throw error;
    }
  },
  updateAboutContent: async (updatedContent: any) => {
    return useMockApi ? mockAboutApi.updateAboutContent(updatedContent) : aboutApi.updateAboutContent(updatedContent);
  },
};

// Configure API settings
export const configureApi = (options: { useMockApi?: boolean } = {}) => {
  // If explicitly provided in options, use that value
  if (options.useMockApi !== undefined) {
    useMockApi = options.useMockApi;
    console.log(`API configured to use ${useMockApi ? 'mock' : 'real'} implementation`);
  } 
  // Otherwise use the environment variable value
  else if (import.meta.env.VITE_USE_MOCK_DATA !== undefined) {
    useMockApi = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    console.log(`API configured from environment to use ${useMockApi ? 'mock' : 'real'} implementation`);
  }

  return {
    useMockApi,
    setUseMockApi: (value: boolean) => {
      useMockApi = value;
      console.log(`API switched to ${useMockApi ? 'mock' : 'real'} implementation`);
    },
    // Add a utility to check the current setting
    isMockApi: () => useMockApi
  };
}; 