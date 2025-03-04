
import { useParams } from 'react-router-dom';
import { BLOG_POSTS, BlogPost } from '@/data/blogData';

export const useBlogPost = (): { post: BlogPost | undefined } => {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id || '1');
  
  const post = BLOG_POSTS.find(post => post.id === postId);
  
  return { post };
};
