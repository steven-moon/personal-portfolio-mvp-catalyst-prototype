import { BlogPost, BLOG_POSTS } from '../data/blogData';
import { Project, PROJECTS } from '../data/projectData';
import { HomePage, HOME_DATA } from '../data/homeData';
import { ContactInfo, CONTACT_DATA } from '../data/contactData';
import { storeProfileImage } from './localStorageUtils';

// In-memory store for the mock data
let blogPosts = [...BLOG_POSTS];
let projects = [...PROJECTS];
let homeData = { ...HOME_DATA };
let contactData = { ...CONTACT_DATA };

// Helper to generate new IDs
const getNextId = (items: { id: number }[]): number => {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
};

// Mock delay to simulate network latency
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock implementation for BlogPost API
export const mockBlogApi = {
  // Get all blog posts
  async getAllBlogPosts(): Promise<BlogPost[]> {
    await delay();
    return [...blogPosts];
  },

  // Get blog post by ID
  async getBlogPostById(id: number): Promise<BlogPost> {
    await delay();
    const post = blogPosts.find(post => post.id === id);
    if (!post) {
      throw new Error(`Blog post with ID ${id} not found`);
    }
    return { ...post };
  },

  // Create new blog post
  async createBlogPost(blogPost: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    await delay();
    const newPost = {
      ...blogPost,
      id: getNextId(blogPosts),
    };
    blogPosts.push(newPost);
    return { ...newPost };
  },

  // Update blog post
  async updateBlogPost(
    id: number,
    blogPostUpdate: Partial<Omit<BlogPost, 'id'>>
  ): Promise<BlogPost> {
    await delay();
    const index = blogPosts.findIndex(post => post.id === id);
    if (index === -1) {
      throw new Error(`Blog post with ID ${id} not found`);
    }
    const updatedPost = {
      ...blogPosts[index],
      ...blogPostUpdate,
    };
    blogPosts[index] = updatedPost;
    return { ...updatedPost };
  },

  // Delete blog post
  async deleteBlogPost(id: number): Promise<void> {
    await delay();
    const index = blogPosts.findIndex(post => post.id === id);
    if (index === -1) {
      throw new Error(`Blog post with ID ${id} not found`);
    }
    blogPosts.splice(index, 1);
  },

  // Search blog posts
  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    await delay();
    const lowerQuery = query.toLowerCase();
    return blogPosts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) || 
      post.content.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery)
    );
  },

  // Get blog posts by category
  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    await delay();
    return blogPosts.filter(post => 
      post.category.toLowerCase() === category.toLowerCase()
    );
  }
};

// Mock implementation for Project API
export const mockProjectApi = {
  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    await delay();
    return [...projects];
  },

  // Get project by ID
  async getProjectById(id: number): Promise<Project> {
    await delay();
    const project = projects.find(project => project.id === id);
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    return { ...project };
  },

  // Create new project
  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    await delay();
    const newProject = {
      ...project,
      id: getNextId(projects),
    };
    projects.push(newProject);
    return { ...newProject };
  },

  // Update project
  async updateProject(
    id: number,
    projectUpdate: Partial<Omit<Project, 'id'>>
  ): Promise<Project> {
    await delay();
    const index = projects.findIndex(project => project.id === id);
    if (index === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }
    const updatedProject = {
      ...projects[index],
      ...projectUpdate,
    };
    projects[index] = updatedProject;
    return { ...updatedProject };
  },

  // Delete project
  async deleteProject(id: number): Promise<void> {
    await delay();
    const index = projects.findIndex(project => project.id === id);
    if (index === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }
    projects.splice(index, 1);
  },

  // Get projects by tag
  async getProjectsByTag(tag: string): Promise<Project[]> {
    await delay();
    return projects.filter(project => 
      project.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  },

  // Upload project images (mock implementation)
  async uploadProjectImages(
    projectId: number,
    images: File[]
  ): Promise<string[]> {
    await delay(500); // Longer delay to simulate upload
    
    // Find the project
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    // Generate mock image URLs
    const imageUrls = images.map((_, index) => 
      `/images/projects/project-${projectId}-image-${Date.now()}-${index}.jpg`
    );
    
    // Update the project with new images
    const project = projects[projectIndex];
    projects[projectIndex] = {
      ...project,
      images: [...(project.images || []), ...imageUrls]
    };
    
    return imageUrls;
  }
};

// Mock implementation for Home API
export const mockHomeApi = {
  // Get home page content
  async getHomeContent(): Promise<HomePage> {
    await delay();
    return { ...homeData };
  },

  // Update home page content
  async updateHomeContent(updatedContent: HomePage): Promise<HomePage> {
    await delay();
    homeData = { ...updatedContent };
    return { ...homeData };
  },

  // Upload profile image
  async uploadProfileImage(image: File): Promise<string> {
    await delay();
    
    try {
      console.log("Mock API: Uploading profile image", image.name, image.size);
      
      // Store the image locally using our storage utility
      const localPath = await storeProfileImage(image);
      console.log("Mock API: Image stored successfully at:", localPath);
      
      return localPath;
    } catch (error) {
      console.error("Mock API: Failed to store image locally:", error);
      
      // Fallback to placeholder service if local storage fails
      const width = 500;
      const height = 500;
      const randomId = Math.floor(Math.random() * 1000);
      const fallbackUrl = `https://picsum.photos/id/${randomId}/${width}/${height}`;
      console.log("Mock API: Using fallback image:", fallbackUrl);
      
      return fallbackUrl;
    }
  }
};

// Mock implementation for Contact API
export const mockContactApi = {
  // Get contact info
  async getContactInfo(): Promise<ContactInfo> {
    await delay();
    return { ...contactData };
  },

  // Update contact info
  async updateContactInfo(updatedContact: ContactInfo): Promise<ContactInfo> {
    await delay();
    contactData = { ...updatedContact };
    return { ...contactData };
  }
}; 