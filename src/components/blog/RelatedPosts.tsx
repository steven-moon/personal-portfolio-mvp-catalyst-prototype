import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import LocalImage from '@/components/ui/LocalImage';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
}

interface RelatedPostsProps {
  posts: BlogPost[];
  currentPostId: number;
}

const RelatedPosts = ({ posts, currentPostId }: RelatedPostsProps) => {
  // Filter out the current post and get up to 3 related posts
  const relatedPosts = posts
    .filter(post => post.id !== currentPostId)
    .slice(0, 3);
  
  if (relatedPosts.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold mb-6 text-foreground">Related Articles</h3>
      
      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map(post => (
          <NeumorphicCard key={post.id} className="overflow-hidden h-full flex flex-col">
            <div className="relative h-40 overflow-hidden rounded-t-xl">
              <LocalImage 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-contain object-center max-w-full"
                fallbackSrc="https://via.placeholder.com/400x300?text=Related+Post"
              />
            </div>
            
            <div className="p-4 flex-grow flex flex-col">
              <div className="flex items-center text-muted-foreground text-sm mb-2">
                <Calendar size={14} className="mr-1" />
                <span>{post.date}</span>
              </div>
              
              <h4 className="text-lg font-medium mb-3 text-foreground">{post.title}</h4>
              
              <Link 
                to={`/blog/${post.id}`} 
                className="inline-flex items-center text-primary hover:underline mt-auto"
              >
                Read more <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </NeumorphicCard>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
