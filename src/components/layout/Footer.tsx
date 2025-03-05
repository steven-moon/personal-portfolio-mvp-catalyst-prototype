import React from 'react';
import { Github, Linkedin, Twitter, Instagram, Youtube, Facebook, Mail } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

// Helper function to validate URLs
const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

const Footer = () => {
  const { siteSettings, loading } = useSiteSettings();
  
  // Don't render social media icons while loading
  if (loading) {
    return (
      <footer className="w-full py-4 px-6 border-t border-gray-200 dark:border-gray-800 bg-background z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Loading...
            </p>
          </div>
          <div className="flex items-center gap-4 justify-center">
            {/* Loading state */}
          </div>
        </div>
      </footer>
    );
  }

  const { socialMedia, general } = siteSettings;
  const authorName = general.authorName || 'Portfolio';

  return (
    <footer className="w-full py-4 px-6 border-t border-gray-200 dark:border-gray-800 bg-background z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {authorName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 justify-center">
            {socialMedia.enableGithub && isValidUrl(socialMedia.githubUrl) && (
              <a 
                href={socialMedia.githubUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 neu-flat dark:shadow-dark-neu-flat rounded-full hover:scale-105 transition-medium text-foreground"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            )}
            
            {socialMedia.enableLinkedin && isValidUrl(socialMedia.linkedinUrl) && (
              <a 
                href={socialMedia.linkedinUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 neu-flat dark:shadow-dark-neu-flat rounded-full hover:scale-105 transition-medium text-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            )}
            
            {socialMedia.enableTwitter && isValidUrl(socialMedia.twitterUrl) && (
              <a 
                href={socialMedia.twitterUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 neu-flat dark:shadow-dark-neu-flat rounded-full hover:scale-105 transition-medium text-foreground"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            )}
            
            {socialMedia.enableInstagram && isValidUrl(socialMedia.instagramUrl) && (
              <a 
                href={socialMedia.instagramUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 neu-flat dark:shadow-dark-neu-flat rounded-full hover:scale-105 transition-medium text-foreground"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            )}
            
            {socialMedia.enableYoutube && isValidUrl(socialMedia.youtubeUrl) && (
              <a 
                href={socialMedia.youtubeUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 neu-flat dark:shadow-dark-neu-flat rounded-full hover:scale-105 transition-medium text-foreground"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            )}
            
            {socialMedia.enableFacebook && isValidUrl(socialMedia.facebookUrl) && (
              <a 
                href={socialMedia.facebookUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 neu-flat dark:shadow-dark-neu-flat rounded-full hover:scale-105 transition-medium text-foreground"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            )}
            
            {general.showEmailInFooter && general.email && (
              <a 
                href={`mailto:${general.email}`} 
                className="p-2 neu-flat dark:shadow-dark-neu-flat rounded-full hover:scale-105 transition-medium text-foreground"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
