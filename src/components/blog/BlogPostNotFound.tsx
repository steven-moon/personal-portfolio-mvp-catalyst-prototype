
import React from 'react';
import { Link } from 'react-router-dom';

const BlogPostNotFound = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-center">
      <h1 className="text-3xl font-bold">Blog post not found</h1>
      <Link to="/blog" className="text-neu-accent hover:underline mt-4 inline-block">
        ← Back to all posts
      </Link>
    </div>
  );
};

export default BlogPostNotFound;
