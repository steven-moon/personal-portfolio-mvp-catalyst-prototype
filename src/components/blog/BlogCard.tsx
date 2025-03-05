import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, ChevronRight } from 'lucide-react';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import { BlogPost } from '@/data/blogData';
import LocalImage from '@/components/ui/LocalImage';

interface BlogCardProps {
  post: BlogPost;
  isAdmin?: boolean;
}

const BlogCard = ({ post, isAdmin = false }: BlogCardProps) => {
  const linkPath = isAdmin ? `/admin/blog/edit/${post.id}` : `/blog/${post.id}`;
  const viewLinkPath = `/blog/${post.id}`;
  
  return (
    <NeumorphicCard className="overflow-hidden h-full flex flex-col">
      <Link to={viewLinkPath} className="relative h-48 overflow-hidden rounded-t-xl">
        <LocalImage 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
          fallbackSrc="https://via.placeholder.com/800x400?text=Featured+Image"
          style={{ maxWidth: '100%' }}
        />
      </Link>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center space-x-4 text-muted-foreground text-sm mb-3">
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed text-primary">
            <Tag size={12} className="mr-1" />
            {post.category}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-foreground">{post.title}</h3>
        <p className="text-muted-foreground mb-4 flex-grow">{post.excerpt}</p>
        
        <Link 
          to={linkPath} 
          className="inline-flex items-center text-primary hover:underline mt-auto"
        >
          {isAdmin ? "Edit post" : "Read more"} <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </NeumorphicCard>
  );
};

export default BlogCard;
