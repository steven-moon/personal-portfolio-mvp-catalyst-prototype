
import React from 'react';
import BlogHeader from '@/components/blog/BlogHeader';
import BlogList from '@/components/blog/BlogList';

const Blog = () => {
  return (
    <div className="page-transition container mx-auto px-6 py-12">
      <BlogHeader />
      <BlogList />
    </div>
  );
};

export default Blog;
