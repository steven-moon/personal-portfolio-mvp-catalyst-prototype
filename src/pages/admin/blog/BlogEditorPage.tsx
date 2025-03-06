import React from 'react';
import BlogEditor from '@/components/admin/BlogEditor';
import NeumorphicCard from '@/components/ui/NeumorphicCard';

const BlogEditorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <NeumorphicCard className="p-6">
          <BlogEditor />
        </NeumorphicCard>
      </div>
    </div>
  );
};

export default BlogEditorPage; 