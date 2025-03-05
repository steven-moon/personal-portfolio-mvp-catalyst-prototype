import React, { useState } from 'react';
import { Github, Linkedin, Twitter, Instagram, Youtube, Facebook, Mail, Send } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { toast } from 'sonner';
import NeumorphicButton from '@/components/ui/NeumorphicButton';

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

// Helper function to validate email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Footer = () => {
  const { siteSettings, loading } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Don't render social media icons while loading
  if (loading) {
    return (
      <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-800 mt-20 bg-background">
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

  const { socialMedia, general, features } = siteSettings;
  const authorName = general.authorName || 'Portfolio';

  return (
    <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-800 mt-20 bg-background">
      <div className="max-w-7xl mx-auto">
        {features.enableNewsletter && (
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-md mx-auto text-center">
              <h3 className="text-lg font-medium mb-3 text-foreground">Subscribe to Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Stay updated with our latest projects and articles
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                  required
                />
                <NeumorphicButton 
                  type="submit" 
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Subscribe
                    </>
                  )}
                </NeumorphicButton>
              </form>
            </div>
          </div>
        )}

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
