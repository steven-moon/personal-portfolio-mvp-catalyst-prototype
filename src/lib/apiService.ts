import { mockBlogApi, mockProjectApi } from './mockApi';
import * as blogApi from './blogApi';
import * as projectApi from './projectApi';

// Determine whether to use mock API or real API
// In a real app, this would be controlled by environment variables
const USE_MOCK_API = true; // Set to false to use real API

/**
 * BlogPost API - Exports all blog post related API functions
 */
export const BlogService = USE_MOCK_API ? mockBlogApi : {
  getAllBlogPosts: blogApi.getAllBlogPosts,
  getBlogPostById: blogApi.getBlogPostById,
  createBlogPost: blogApi.createBlogPost,
  updateBlogPost: blogApi.updateBlogPost,
  deleteBlogPost: blogApi.deleteBlogPost,
  searchBlogPosts: blogApi.searchBlogPosts,
  getBlogPostsByCategory: blogApi.getBlogPostsByCategory,
};

/**
 * Project API - Exports all project related API functions
 */
export const ProjectService = USE_MOCK_API ? mockProjectApi : {
  getAllProjects: projectApi.getAllProjects,
  getProjectById: projectApi.getProjectById,
  createProject: projectApi.createProject,
  updateProject: projectApi.updateProject,
  deleteProject: projectApi.deleteProject,
  getProjectsByTag: projectApi.getProjectsByTag,
  uploadProjectImages: projectApi.uploadProjectImages,
};

// Optional: Additional service configuration and setup
export const configureApi = (options: { useMockApi?: boolean } = {}) => {
  // This would set up global API configuration, authentication, etc.
  console.log(`API configured with ${options.useMockApi ? 'mock' : 'real'} implementation`);
}; 