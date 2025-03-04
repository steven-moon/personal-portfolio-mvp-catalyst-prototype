import { BlogPost } from '../data/blogData';
import { apiGet, apiPost, apiPut, apiDelete } from './api';

const BLOG_ENDPOINT = '/blog';

/**
 * Fetch all blog posts
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return apiGet<BlogPost[]>(BLOG_ENDPOINT);
}

/**
 * Fetch a single blog post by ID
 */
export async function getBlogPostById(id: number): Promise<BlogPost> {
  return apiGet<BlogPost>(`${BLOG_ENDPOINT}/${id}`);
}

/**
 * Create a new blog post
 */
export async function createBlogPost(blogPost: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  return apiPost<BlogPost, Omit<BlogPost, 'id'>>(BLOG_ENDPOINT, blogPost);
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(
  id: number,
  blogPost: Partial<Omit<BlogPost, 'id'>>
): Promise<BlogPost> {
  return apiPut<BlogPost, Partial<Omit<BlogPost, 'id'>>>(`${BLOG_ENDPOINT}/${id}`, blogPost);
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: number): Promise<void> {
  return apiDelete<void>(`${BLOG_ENDPOINT}/${id}`);
}

/**
 * Search blog posts by query
 */
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  return apiGet<BlogPost[]>(`${BLOG_ENDPOINT}/search?q=${encodeURIComponent(query)}`);
}

/**
 * Filter blog posts by category
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  return apiGet<BlogPost[]>(`${BLOG_ENDPOINT}/category/${encodeURIComponent(category)}`);
} 