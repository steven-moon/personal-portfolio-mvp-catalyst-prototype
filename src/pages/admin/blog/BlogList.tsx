import React from 'react';
import BlogPostsList from '@/components/admin/BlogPostsList';
import NeumorphicCard from '@/components/ui/NeumorphicCard';

const BlogList = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <NeumorphicCard className="p-6">
          <BlogPostsList />
        </NeumorphicCard>
      </div>
    </div>
  );
};

export default BlogList; 