import React from 'react';
import { Calendar, User, Tag } from 'lucide-react';

interface BlogMetaProps {
  date: string;
  author: string;
  category: string;
}

const BlogMeta = ({ date, author, category }: BlogMetaProps) => {
  return (
    <>
      <div className="mb-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed text-primary">
          <Tag size={12} className="mr-1" />
          {category}
        </span>
      </div>
      
      <div className="flex items-center space-x-4 text-muted-foreground mb-8">
        <div className="flex items-center">
          <Calendar size={16} className="mr-1" />
          <span>{date}</span>
        </div>
        <div className="flex items-center">
          <User size={16} className="mr-1" />
          <span>{author}</span>
        </div>
      </div>
    </>
  );
};

export default BlogMeta;
