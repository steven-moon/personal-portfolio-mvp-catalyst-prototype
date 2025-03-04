
import React from 'react';
import BlogCard from './BlogCard';
import { BLOG_POSTS } from '@/data/blogData';

const BlogList = () => {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
      {BLOG_POSTS.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BlogList;
