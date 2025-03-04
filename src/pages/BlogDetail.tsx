import React from 'react';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import BlogDetailHeader from '@/components/blog/BlogDetailHeader';
import BlogMeta from '@/components/blog/BlogMeta';
import BlogContent from '@/components/blog/BlogContent';
import BlogShareSection from '@/components/blog/BlogShareSection';
import BlogPostNotFound from '@/components/blog/BlogPostNotFound';
import { useBlogPost } from '@/hooks/useBlogPost';

const BlogDetail = () => {
  const { post } = useBlogPost();
  
  if (!post) {
    return <BlogPostNotFound />;
  }

  return (
    <div className="page-transition container mx-auto px-6 py-12 bg-background">
      <BlogDetailHeader />
      
      <div className="max-w-4xl mx-auto">
        <NeumorphicCard className="overflow-hidden">
          <div className="relative h-64 md:h-80 overflow-hidden rounded-t-xl">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8">
            <BlogMeta 
              date={post.date}
              author={post.author}
              category={post.category}
            />
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{post.title}</h1>
            
            <BlogContent content={post.content} />
            
            <BlogShareSection />
          </div>
        </NeumorphicCard>
      </div>
    </div>
  );
};

export default BlogDetail;
