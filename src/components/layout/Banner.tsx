import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const Banner = () => {
  const { siteSettings, loading } = useSiteSettings();
  
  // Don't try to access URLs if still loading
  const socialMedia = {
    githubUrl: 'https://github.com/steven-moon',
    twitterUrl: 'https://twitter.com/stevenmoon',
    linkedinUrl: 'https://linkedin.com/in/stevenmoon'
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full h-[var(--banner-height)] flex items-center justify-between px-4 sm:px-6 text-sm font-medium bg-primary text-primary-foreground shadow-md z-50">
      <div className="flex items-center space-x-4">
        {socialMedia.githubUrl && (
          <a 
            href={socialMedia.githubUrl} 
            aria-label="GitHub" 
            className="hover:opacity-80 transition-opacity flex items-center"
          >
            <Github size={18} strokeWidth={2} />
          </a>
        )}
        {socialMedia.linkedinUrl && (
          <a 
            href={socialMedia.linkedinUrl} 
            aria-label="LinkedIn" 
            className="hover:opacity-80 transition-opacity flex items-center"
          >
            <Linkedin size={18} strokeWidth={2} />
          </a>
        )}
        {socialMedia.twitterUrl && (
          <a 
            href={socialMedia.twitterUrl} 
            aria-label="Twitter" 
            className="hover:opacity-80 transition-opacity flex items-center"
          >
            <Twitter size={18} strokeWidth={2} />
          </a>
        )}
      </div>
      
      <div className="text-center px-2">
        This is a Catalyst app site learn more at{' '}
        <a 
          href="https://clevercoding.com" 
          className="underline font-bold hover:opacity-90 transition-opacity ml-1"
        >
          https://clevercoding.com
        </a>
      </div>
      
      <div className="w-[88px]">
        {/* Empty div to balance the layout */}
      </div>
    </div>
  );
};

export default Banner; 