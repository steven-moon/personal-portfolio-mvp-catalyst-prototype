
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BlogDetailHeader = () => {
  return (
    <Link to="/blog" className="inline-flex items-center text-neu-accent hover:underline mb-8">
      <ArrowLeft size={16} className="mr-1" /> Back to all posts
    </Link>
  );
};

export default BlogDetailHeader;
