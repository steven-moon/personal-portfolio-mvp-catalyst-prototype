import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BlogPost } from '@/data/blogData';
import { BlogService } from '@/lib/apiService';

export const useBlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id || '1');
  
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const data = await BlogService.getBlogPostById(postId);
        setPost(data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching blog post with ID ${postId}:`, err);
        setError('Failed to load the blog post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [postId]);
  
  return { post, isLoading, error };
};
