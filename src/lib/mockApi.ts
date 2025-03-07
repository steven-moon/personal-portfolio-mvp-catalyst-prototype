import { BlogPost, BLOG_POSTS } from '../data/blogData';
import { Project, PROJECTS } from '../data/projectData';
import { HomePage, HOME_DATA } from '../data/homeData';
import { ContactInfo, CONTACT_DATA } from '../data/contactData';
import { AboutMeData, ABOUT_DATA } from '../data/aboutData';
import { storeProfileImage } from './localStorageUtils';

// Storage keys for persisting mock data
const STORAGE_KEYS = {
  BLOGS: 'mock_blog_posts',
  PROJECTS: 'mock_projects',
  HOME: 'mock_home_data',
  CONTACT: 'mock_contact_data',
  ABOUT: 'mock_about_data',
  CONTACT_MESSAGES: 'mock_contact_messages',
  TOKEN: 'auth_token'
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
    
    // About
    const storedAbout = localStorage.getItem(STORAGE_KEYS.ABOUT);
    let aboutDataObj = { ...ABOUT_DATA };
    if (storedAbout) {
      aboutDataObj = JSON.parse(storedAbout);
      console.log('Loaded about data from localStorage');
    }

    return {
      blogPosts: blogPostsData,
      projects: projectsData,
      homeData: homeDataObj,
      contactData: contactDataObj,
      aboutData: aboutDataObj
    };
  } catch (error) {
    console.error('Error loading data from localStorage, using defaults:', error);
    // Fallback to default data
    return {
      blogPosts: [...BLOG_POSTS],
      projects: [...PROJECTS],
      homeData: { ...HOME_DATA },
      contactData: { ...CONTACT_DATA },
      aboutData: { ...ABOUT_DATA }
    };
  }
};

// Initialize data
const { blogPosts, projects, homeData, contactData, aboutData } = loadOrInitializeData();

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
    const success = persistData(STORAGE_KEYS.BLOGS, blogPosts);
    
    if (!success) {
      console.warn('Failed to persist blog posts after deletion');
      // Still return successfully as the in-memory data was updated
    }
    
    // Return void as expected, no need to return JSON data for delete operations
    return;
  },
  
  // Search blog posts
  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    await delay();
    if (!query) return [...blogPosts];
    
    const lowercaseQuery = query.toLowerCase();
    return blogPosts.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) || 
      post.content.toLowerCase().includes(lowercaseQuery) ||
      (typeof post.category === 'string' 
        ? post.category.toLowerCase().includes(lowercaseQuery)
        : post.category.name.toLowerCase().includes(lowercaseQuery))
    );
  },
  
  // Get posts by category
  async getBlogPostsByCategory(categoryId: number): Promise<BlogPost[]> {
    await delay();
    // In the mock implementation, we'll map the categoryId to a category name
    // since we don't have a separate categories table
    const categories = [...new Set(blogPosts.map(post => post.category))];
    const category = categories[categoryId - 1] || ''; // Map ID to category name (1-indexed)
    
    if (!category) return [];
    
    return blogPosts.filter(post => 
      post.category === category
    );
  },

  // Get all categories
  async getAllCategories(): Promise<any[]> {
    await delay();
    // Extract unique categories from blog posts
    const categories = [...new Set(blogPosts.map(post => post.category))];
    return categories.map((name, index) => ({
      id: index + 1,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  },

  // Get posts by author
  async getBlogPostsByAuthor(authorId: number): Promise<BlogPost[]> {
    await delay();
    // In the mock implementation, we'll use the author's name
    // since we don't have a separate authors table with IDs
    const author = `Author ${authorId}`; // Simple mapping for mock data
    return blogPosts.filter(post => post.author === author);
  },

  // Upload blog image
  async uploadBlogImage(image: File): Promise<string> {
    // This is a mock implementation
    await delay();
    
    console.log("Mock API: Uploading blog image", image.name, image.size);
    
    // In a real app, we would upload to a server and get back a URL
    // Here we just pretend we did and return a URL pattern
    const fileName = image.name.replace(/\s+/g, '-').toLowerCase();
    return `/assets/images/blog/${Date.now()}-${fileName}`;
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

// Create example contact messages for mock data
const mockContactMessages = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Collaboration Opportunity',
    message: 'Hi there,\n\nI saw your portfolio and I\'m impressed with your work. Would you be interested in collaborating on a project? Let\'s chat soon.\n\nBest,\nJohn',
    isRead: true,
    createdAt: '2025-03-01T10:30:00Z',
    updatedAt: '2025-03-01T10:30:00Z'
  },
  {
    id: 2,
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    subject: 'Website Design Inquiry',
    message: 'Hello,\n\nI\'m looking for someone to redesign my company\'s website. Your portfolio looks great and I think you might be a good fit. Could you let me know your availability and rates?\n\nThank you,\nSarah',
    isRead: false,
    createdAt: '2025-03-04T14:15:00Z',
    updatedAt: '2025-03-04T14:15:00Z'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    subject: 'Speaking Opportunity',
    message: 'Hi,\n\nI\'m organizing a tech conference and would love to have you as a speaker. Please let me know if you\'re interested and we can discuss the details.\n\nRegards,\nMike',
    isRead: false,
    createdAt: '2025-03-05T09:45:00Z',
    updatedAt: '2025-03-05T09:45:00Z'
  }
];

// Store the messages in localStorage
try {
  const storedMessages = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES);
  if (!storedMessages) {
    localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(mockContactMessages));
  }
} catch (error) {
  console.error('Failed to initialize mock contact messages:', error);
}

// Function to check if the user is authenticated in the mock API
const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
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
  },
  
  // Submit contact message
  async submitContactMessage(formData: { name: string; email: string; subject: string; message: string }): Promise<{ success: boolean; message: string; id: number }> {
    await delay();
    
    try {
      // Get existing messages
      let messages = [];
      const storedMessages = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES);
      
      if (storedMessages) {
        messages = JSON.parse(storedMessages);
      }
      
      // Create new message
      const newMessage = {
        id: getNextId(messages),
        ...formData,
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to messages array
      messages.push(newMessage);
      
      // Save back to localStorage
      localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(messages));
      
      return {
        success: true,
        message: 'Contact message submitted successfully',
        id: newMessage.id
      };
    } catch (error) {
      console.error('Mock API - Error storing contact message:', error);
      throw new Error('Failed to submit contact message');
    }
  },
  
  // Get all contact messages
  async getContactMessages(): Promise<any[]> {
    await delay();
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Authentication required to access messages');
    }
    
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES);
      const messages = storedMessages ? JSON.parse(storedMessages) : [];
      return messages.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Mock API - Error fetching contact messages:', error);
      return [];
    }
  },
  
  // Get contact message by ID
  async getContactMessageById(id: number): Promise<any> {
    await delay();
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Authentication required to access message details');
    }
    
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES);
      const messages = storedMessages ? JSON.parse(storedMessages) : [];
      const message = messages.find((msg: any) => msg.id === id);
      
      if (!message) {
        throw new Error(`Message with ID ${id} not found`);
      }
      
      return message;
    } catch (error) {
      console.error(`Mock API - Error fetching contact message with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Update contact message
  async updateContactMessage(id: number, updates: { isRead?: boolean }): Promise<any> {
    await delay();
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Authentication required to update message');
    }
    
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES);
      const messages = storedMessages ? JSON.parse(storedMessages) : [];
      const messageIndex = messages.findIndex((msg: any) => msg.id === id);
      
      if (messageIndex === -1) {
        throw new Error(`Message with ID ${id} not found`);
      }
      
      // Update the message
      messages[messageIndex] = {
        ...messages[messageIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // Save back to localStorage
      localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(messages));
      
      return messages[messageIndex];
    } catch (error) {
      console.error(`Mock API - Error updating contact message with ID ${id}:`, error);
      throw error;
    }
  }
};

// Mock implementation for About API
export const mockAboutApi = {
  // Get about page content
  async getAboutContent(): Promise<AboutMeData> {
    await delay();
    return { ...aboutData };
  },

  // Update about page content
  async updateAboutContent(updatedContent: AboutMeData): Promise<AboutMeData> {
    await delay();
    Object.assign(aboutData, updatedContent);
    persistData(STORAGE_KEYS.ABOUT, aboutData);
    return { ...aboutData };
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
    contactData,
    aboutData
  })
}; 