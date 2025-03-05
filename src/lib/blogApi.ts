import { BlogPost } from '../data/blogData';
import { apiGet, apiPost, apiPut, apiDelete } from './api';
import { API_CONFIG } from '../config';

const BLOG_ENDPOINT = '/api/blog';

/**
 * Fetch all blog posts
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return apiGet<BlogPost[]>(`${BLOG_ENDPOINT}/posts`);
}

/**
 * Fetch a single blog post by ID
 */
export async function getBlogPostById(id: number): Promise<BlogPost> {
  return apiGet<BlogPost>(`${BLOG_ENDPOINT}/posts/${id}`);
}

/**
 * Create a new blog post
 */
export async function createBlogPost(blogPost: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  return apiPost<BlogPost, Omit<BlogPost, 'id'>>(`${BLOG_ENDPOINT}/posts`, blogPost);
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(
  id: number,
  blogPost: Partial<Omit<BlogPost, 'id'>>
): Promise<BlogPost> {
  return apiPut<BlogPost, Partial<Omit<BlogPost, 'id'>>>(`${BLOG_ENDPOINT}/posts/${id}`, blogPost);
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: number): Promise<void> {
  return apiDelete<void>(`${BLOG_ENDPOINT}/posts/${id}`);
}

/**
 * Search blog posts by query
 */
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  return apiGet<BlogPost[]>(`${BLOG_ENDPOINT}/posts?search=${encodeURIComponent(query)}`);
}

/**
 * Filter blog posts by category
 */
export async function getBlogPostsByCategory(categoryId: number): Promise<BlogPost[]> {
  return apiGet<BlogPost[]>(`${BLOG_ENDPOINT}/categories/${categoryId}/posts`);
}

/**
 * Get all blog categories
 */
export async function getAllCategories(): Promise<any[]> {
  return apiGet<any[]>(`${BLOG_ENDPOINT}/categories`);
}

/**
 * Get blog posts by author
 */
export async function getBlogPostsByAuthor(authorId: number): Promise<BlogPost[]> {
  return apiGet<BlogPost[]>(`${BLOG_ENDPOINT}/authors/${authorId}/posts`);
}

/**
 * Upload an image for a blog post
 * @param image The image file to upload
 * @returns Promise containing the URL of the uploaded image on the server
 */
export async function uploadBlogImage(image: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', image);

  // Get the authentication token
  const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
  
  const response = await fetch(`${BLOG_ENDPOINT}/upload-image`, {
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type for FormData as it will be set automatically with boundary
      // Include the authorization header
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Image upload failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return data.url;
} 