import { useState, useEffect } from 'react';
import { BlogPost } from '../data/blogData';
import { BlogService } from '../lib/apiService';

interface UseBlogPostsOptions {
  category?: string;
  searchQuery?: string;
  initialLoading?: boolean;
}

export function useBlogPosts(options: UseBlogPostsOptions = {}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(options.initialLoading ?? true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: BlogPost[];
      
      if (options.searchQuery) {
        data = await BlogService.searchBlogPosts(options.searchQuery);
      } else if (options.category) {
        data = await BlogService.getBlogPostsByCategory(options.category);
      } else {
        data = await BlogService.getAllBlogPosts();
      }
      
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to refetch posts
  const refetch = () => fetchPosts();

  // Function to get a single post by id
  const getPostById = async (id: number) => {
    try {
      setLoading(true);
      return await BlogService.getBlogPostById(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching the blog post'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new post
  const createPost = async (post: Omit<BlogPost, 'id'>) => {
    try {
      setLoading(true);
      const newPost = await BlogService.createBlogPost(post);
      setPosts(prev => [...prev, newPost]);
      return newPost;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while creating the blog post'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to update a post
  const updatePost = async (id: number, post: Partial<Omit<BlogPost, 'id'>>) => {
    try {
      setLoading(true);
      const updatedPost = await BlogService.updateBlogPost(id, post);
      setPosts(prev => 
        prev.map(p => p.id === id ? updatedPost : p)
      );
      return updatedPost;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while updating the blog post'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a post
  const deletePost = async (id: number) => {
    try {
      setLoading(true);
      await BlogService.deleteBlogPost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while deleting the blog post'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch posts on mount or when options change
  useEffect(() => {
    fetchPosts();
  }, [options.category, options.searchQuery]);

  return {
    posts,
    loading,
    error,
    refetch,
    getPostById,
    createPost,
    updatePost,
    deletePost
  };
} 