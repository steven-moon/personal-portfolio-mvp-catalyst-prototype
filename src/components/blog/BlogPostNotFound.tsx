import React from 'react';
import { Link } from 'react-router-dom';

const BlogPostNotFound = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-center bg-background">
      <h1 className="text-3xl font-bold text-foreground">Blog post not found</h1>
      <Link to="/blog" className="text-primary hover:underline mt-4 inline-block">
        ← Back to all posts
      </Link>
    </div>
  );
};

export default BlogPostNotFound;
