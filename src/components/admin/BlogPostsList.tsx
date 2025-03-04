import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { FilePlus, FileEdit, Trash, FileText, ExternalLink } from 'lucide-react';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import NeumorphicCard from '@/components/ui/NeumorphicCard';

// Mock data from the Blog page
const BLOG_POSTS = [
  {
    id: 1,
    title: "Getting Started with React in 2023",
    excerpt: "A comprehensive guide to modern React development practices...",
    date: "May 15, 2023",
    author: "John Doe",
    category: "Development",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    title: "The Future of UI Design: Neumorphism Explained",
    excerpt: "Explore the evolution of Neumorphism as a design trend...",
    date: "June 22, 2023",
    author: "John Doe",
    category: "Design",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "TypeScript Tips for Better Code Quality",
    excerpt: "Learn advanced TypeScript techniques to improve your code quality...",
    date: "July 8, 2023",
    author: "John Doe",
    category: "Development",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    title: "Building Responsive Layouts with Tailwind CSS",
    excerpt: "A deep dive into creating modern, responsive layouts using Tailwind CSS...",
    date: "August 14, 2023",
    author: "John Doe",
    category: "CSS",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"
  }
];

const BlogPostItem = ({ post, onEdit, onDelete }: { 
  post: typeof BLOG_POSTS[0]; 
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
  const [posts, setPosts] = useState(BLOG_POSTS);
  
  const handleEdit = (id: number) => {
    navigate(`/admin/blog/edit/${id}`);
  };
  
  const handleDelete = (id: number) => {
    // In a real app, this would be an API call to delete the post
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== id));
      toast.success('Blog post deleted successfully');
    }
  };
  
  const handleNewPost = () => {
    navigate('/admin/blog/new');
  };
  
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
            />
            <span className="absolute left-3 top-3 text-muted-foreground">
              <FileText size={18} />
            </span>
          </div>
          
          <select
            className="p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none w-full md:w-48 text-foreground"
          >
            <option value="">All Categories</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="CSS">CSS</option>
          </select>
        </div>
      </div>
      
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
    </div>
  );
};

export default BlogPostsList;
