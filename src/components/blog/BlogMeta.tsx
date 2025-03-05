import React from 'react';
import { Calendar, User, Tag } from 'lucide-react';
import { Author, Category } from '@/data/blogData';
import { formatDate } from '@/lib/dateUtils';

interface BlogMetaProps {
  date: string;
  author: string | Author;
  category: string | Category;
}

const BlogMeta = ({ date, author, category }: BlogMetaProps) => {
  // Helper function to get author display name
  const getAuthorName = (author: string | Author): string => {
    if (typeof author === 'string') {
      return author;
    }
    return author.username;
  };
  
  // Helper function to get category display name
  const getCategoryName = (category: string | Category): string => {
    if (typeof category === 'string') {
      return category;
    }
    return category.name;
  };

  return (
    <>
      <div className="mb-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed text-primary">
          <Tag size={12} className="mr-1" />
          {getCategoryName(category)}
        </span>
      </div>
      
      <div className="flex items-center space-x-4 text-muted-foreground mb-8">
        <div className="flex items-center">
          <Calendar size={16} className="mr-1" />
          <span>{formatDate(date)}</span>
        </div>
        <div className="flex items-center">
          <User size={16} className="mr-1" />
          <span>{getAuthorName(author)}</span>
        </div>
      </div>
    </>
  );
};

export default BlogMeta;
