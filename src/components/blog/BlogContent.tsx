
import React from 'react';

interface BlogContentProps {
  content: string;
}

const BlogContent = ({ content }: BlogContentProps) => {
  return (
    <div 
      className="prose prose-lg prose-headings:font-semibold prose-a:text-neu-accent max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContent;
