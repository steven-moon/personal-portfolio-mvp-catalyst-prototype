import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { FilePlus, FileEdit, Trash, FileText, ExternalLink } from 'lucide-react';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import { BlogService } from '@/lib/apiService';
import { BlogPost } from '@/data/blogData';

const BlogPostItem = ({ post, onEdit, onDelete }: { 
  post: BlogPost; 
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const navigate = useNavigate();
  
  return (
    <NeumorphicCard className="mb-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="w-full md:w-2/3">
          <h3 className="text-lg font-semibold mb-1 text-foreground">{post.title}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed text-primary">
              {post.category}
            </span>
            <span className="text-muted-foreground text-sm">
              {post.date}
            </span>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
        </div>
        
        <div className="flex justify-end mt-4 md:mt-0 md:w-1/3 gap-2">
          <NeumorphicButton 
            size="sm" 
            variant="secondary"
            onClick={() => navigate(`/blog/${post.id}`)}
            className="flex items-center gap-1"
          >
            <ExternalLink size={14} />
            View
          </NeumorphicButton>
          
          <NeumorphicButton 
            size="sm" 
            variant="secondary"
            onClick={() => onEdit(post.id)}
            className="flex items-center gap-1"
          >
            <FileEdit size={14} />
            Edit
          </NeumorphicButton>
          
          <NeumorphicButton 
            size="sm" 
            variant="secondary"
            onClick={() => onDelete(post.id)}
            className="flex items-center gap-1"
          >
            <Trash size={14} />
            Delete
          </NeumorphicButton>
        </div>
      </div>
    </NeumorphicCard>
  );
};

const BlogPostsList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      let data: BlogPost[];
      
      if (searchQuery) {
        data = await BlogService.searchBlogPosts(searchQuery);
      } else if (selectedCategory) {
        data = await BlogService.getBlogPostsByCategory(selectedCategory);
      } else {
        data = await BlogService.getAllBlogPosts();
      }
      
      setPosts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, [searchQuery, selectedCategory]);
  
  const handleEdit = (id: number) => {
    navigate(`/admin/blog/edit/${id}`);
  };
  
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await BlogService.deleteBlogPost(id);
        setPosts(posts.filter(post => post.id !== id));
        toast.success('Blog post deleted successfully');
      } catch (err) {
        console.error('Error deleting blog post:', err);
        toast.error('Failed to delete blog post. Please try again.');
      }
    }
  };
  
  const handleNewPost = () => {
    navigate('/admin/blog/new');
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };
  
  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(posts.map(post => post.category)));
  
  return (
    <div className="container py-8 mx-auto bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage Blog Posts</h1>
        <NeumorphicButton 
          onClick={handleNewPost}
          className="flex items-center gap-2"
        >
          <FilePlus size={18} />
          New Post
        </NeumorphicButton>
      </div>
      
      <div className="bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none pl-10 text-foreground"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <span className="absolute left-3 top-3 text-muted-foreground">
              <FileText size={18} />
            </span>
          </div>
          
          <select
            className="p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none w-full md:w-48 text-foreground"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-lg">Loading blog posts...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      ) : (
        <div>
          {posts.length > 0 ? (
            posts.map(post => (
              <BlogPostItem 
                key={post.id} 
                post={post} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No blog posts found</p>
              <NeumorphicButton 
                onClick={handleNewPost}
                className="flex items-center gap-2 mx-auto"
              >
                <FilePlus size={18} />
                Create Your First Post
              </NeumorphicButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogPostsList;
