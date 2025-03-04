
import React from 'react';
import NeumorphicButton from '@/components/ui/NeumorphicButton';

const BlogShareSection = () => {
  return (
    <div className="mt-12 pt-8 border-t border-neu-border">
      <h3 className="text-lg font-semibold mb-4">Share this article</h3>
      <div className="flex space-x-2">
        <NeumorphicButton size="sm" variant="secondary">Twitter</NeumorphicButton>
        <NeumorphicButton size="sm" variant="secondary">LinkedIn</NeumorphicButton>
        <NeumorphicButton size="sm" variant="secondary">Facebook</NeumorphicButton>
      </div>
    </div>
  );
};

export default BlogShareSection;
