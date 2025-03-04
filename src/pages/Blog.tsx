import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, ChevronRight } from 'lucide-react';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import { BLOG_POSTS } from '@/data/blogData';

const BlogCard = ({ post }: { post: typeof BLOG_POSTS[0] }) => {
  return (
    <NeumorphicCard className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center space-x-4 text-neu-text-secondary text-sm mb-3">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            <span>{post.author}</span>
          </div>
        </div>
        
        <div className="mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neu-bg shadow-neu-pressed text-neu-accent">
            <Tag size={12} className="mr-1" />
            {post.category}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <p className="text-neu-text-secondary mb-4 flex-grow">{post.excerpt}</p>
        
        <Link 
          to={`/blog/${post.id}`} 
          className="inline-flex items-center text-neu-accent hover:underline mt-auto"
        >
          Read more <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </NeumorphicCard>
  );
};

const Blog = () => {
  return (
    <div className="page-transition container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-neu-text-secondary max-w-2xl mx-auto">
          Thoughts, stories, and ideas on web development, design, and technology.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {BLOG_POSTS.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
