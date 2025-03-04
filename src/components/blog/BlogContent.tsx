import React from 'react';

interface BlogContentProps {
  content: string;
}

const BlogContent = ({ content }: BlogContentProps) => {
  return (
    <div 
      className="prose prose-lg dark:prose-invert prose-headings:font-semibold prose-headings:text-foreground prose-a:text-primary max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContent;
