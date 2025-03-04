import { BlogPost, BLOG_POSTS } from '../data/blogData';
import { Project, PROJECTS } from '../data/projectData';
import { HomePage, HOME_DATA } from '../data/homeData';
import { ContactInfo, CONTACT_DATA } from '../data/contactData';
import { storeProfileImage } from './localStorageUtils';

// Storage keys for persisting mock data
const STORAGE_KEYS = {
  BLOGS: 'mock_blog_posts',
  PROJECTS: 'mock_projects',
  HOME: 'mock_home_data',
  CONTACT: 'mock_contact_data'
};

// Load or initialize in-memory store for the mock data
const loadOrInitializeData = () => {
  // Try to load data from localStorage first
  try {
    // BlogPosts
    const storedBlogPosts = localStorage.getItem(STORAGE_KEYS.BLOGS);
    let blogPostsData = [...BLOG_POSTS];
    if (storedBlogPosts) {
      blogPostsData = JSON.parse(storedBlogPosts);
      console.log('Loaded blog posts from localStorage');
    }

    // Projects
    const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    let projectsData = [...PROJECTS];
    if (storedProjects) {
      projectsData = JSON.parse(storedProjects);
      console.log('Loaded projects from localStorage');
    }

    // Home
    const storedHome = localStorage.getItem(STORAGE_KEYS.HOME);
    let homeDataObj = { ...HOME_DATA };
    if (storedHome) {
      homeDataObj = JSON.parse(storedHome);
      console.log('Loaded home data from localStorage');
    }

    // Contact
    const storedContact = localStorage.getItem(STORAGE_KEYS.CONTACT);
    let contactDataObj = { ...CONTACT_DATA };
    if (storedContact) {
      contactDataObj = JSON.parse(storedContact);
      console.log('Loaded contact data from localStorage');
    }

    return {
      blogPosts: blogPostsData,
      projects: projectsData,
      homeData: homeDataObj,
      contactData: contactDataObj
    };
  } catch (error) {
    console.error('Error loading data from localStorage, using defaults:', error);
    // Fallback to default data
    return {
      blogPosts: [...BLOG_POSTS],
      projects: [...PROJECTS],
      homeData: { ...HOME_DATA },
      contactData: { ...CONTACT_DATA }
    };
  }
};

// Initialize data
const { blogPosts, projects, homeData, contactData } = loadOrInitializeData();

// Helper to save data to localStorage
const persistData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Failed to save data to localStorage (${key}):`, error);
    return false;
  }
};

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
    persistData(STORAGE_KEYS.BLOGS, blogPosts);
    return { ...newPost };
  },

  // Update blog post
  async updateBlogPost(
    id: number,
    blogPostUpdate: Partial<Omit<BlogPost, 'id'>>
  ): Promise<BlogPost> {
    await delay();
    const postIndex = blogPosts.findIndex(post => post.id === id);
    
    if (postIndex === -1) {
      throw new Error(`Blog post with ID ${id} not found`);
    }
    
    const updatedPost = {
      ...blogPosts[postIndex],
      ...blogPostUpdate,
    };
    
    blogPosts[postIndex] = updatedPost;
    persistData(STORAGE_KEYS.BLOGS, blogPosts);
    return { ...updatedPost };
  },

  // Delete blog post
  async deleteBlogPost(id: number): Promise<void> {
    await delay();
    const postIndex = blogPosts.findIndex(post => post.id === id);
    
    if (postIndex === -1) {
      throw new Error(`Blog post with ID ${id} not found`);
    }
    
    blogPosts.splice(postIndex, 1);
    persistData(STORAGE_KEYS.BLOGS, blogPosts);
  },
  
  // Search blog posts
  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    await delay();
    if (!query) return [...blogPosts];
    
    const lowercaseQuery = query.toLowerCase();
    return blogPosts.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) || 
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.category.toLowerCase().includes(lowercaseQuery)
    );
  },
  
  // Get posts by category
  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    await delay();
    if (!category) return [...blogPosts];
    
    const lowercaseCategory = category.toLowerCase();
    return blogPosts.filter(post => 
      post.category.toLowerCase() === lowercaseCategory
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
    persistData(STORAGE_KEYS.PROJECTS, projects);
    return { ...newProject };
  },

  // Update project
  async updateProject(
    id: number,
    projectUpdate: Partial<Omit<Project, 'id'>>
  ): Promise<Project> {
    await delay();
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }
    
    const updatedProject = {
      ...projects[projectIndex],
      ...projectUpdate,
    };
    
    projects[projectIndex] = updatedProject;
    persistData(STORAGE_KEYS.PROJECTS, projects);
    return { ...updatedProject };
  },

  // Delete project
  async deleteProject(id: number): Promise<void> {
    await delay();
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }
    
    projects.splice(projectIndex, 1);
    persistData(STORAGE_KEYS.PROJECTS, projects);
  },
  
  // Get projects by tag
  async getProjectsByTag(tag: string): Promise<Project[]> {
    await delay();
    if (!tag) return [...projects];
    
    const lowercaseTag = tag.toLowerCase();
    return projects.filter(project => 
      project.tags.some(t => t.toLowerCase() === lowercaseTag)
    );
  },
  
  // Upload project images
  async uploadProjectImages(
    projectId: number,
    images: File[]
  ): Promise<string[]> {
    await delay();
    // Mock implementation - in a real app, this would upload to cloud storage
    const mockImageUrls = images.map(image => 
      `/images/projects/project-${projectId}-${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.]/g, '_')}.jpg`
    );
    return mockImageUrls;
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
    Object.assign(homeData, updatedContent);
    persistData(STORAGE_KEYS.HOME, homeData);
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
    Object.assign(contactData, updatedContact);
    persistData(STORAGE_KEYS.CONTACT, contactData);
    return { ...contactData };
  }
}; 

// For debugging purposes
export const _debugMockData = {
  resetAllData: () => {
    Object.keys(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(STORAGE_KEYS[key as keyof typeof STORAGE_KEYS]);
    });
    location.reload();
  },
  getCurrentData: () => ({
    blogPosts,
    projects,
    homeData,
    contactData
  })
}; 