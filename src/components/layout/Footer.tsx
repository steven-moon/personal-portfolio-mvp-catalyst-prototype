
import React from 'react';
import { Github, Linkedin, Twitter, Instagram, Youtube, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  // In a real application, this would come from your state management or context
  // For now, we're hardcoding these values to demonstrate the functionality
  const socialMedia = {
    enableGithub: true,
    enableLinkedin: true,
    enableTwitter: true,
    enableInstagram: true,
    enableYoutube: true,
    enableFacebook: true,
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    twitterUrl: 'https://twitter.com',
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com',
    facebookUrl: 'https://facebook.com',
  };

  return (
    <footer className="py-8 px-6 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-neu-text-secondary">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-center">
          {socialMedia.enableGithub && (
            <a 
              href={socialMedia.githubUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 neu-flat rounded-full hover:scale-105 transition-medium"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
          )}
          
          {socialMedia.enableLinkedin && (
            <a 
              href={socialMedia.linkedinUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 neu-flat rounded-full hover:scale-105 transition-medium"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          )}
          
          {socialMedia.enableTwitter && (
            <a 
              href={socialMedia.twitterUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 neu-flat rounded-full hover:scale-105 transition-medium"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
          )}
          
          {socialMedia.enableInstagram && (
            <a 
              href={socialMedia.instagramUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 neu-flat rounded-full hover:scale-105 transition-medium"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
          )}
          
          {socialMedia.enableYoutube && (
            <a 
              href={socialMedia.youtubeUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 neu-flat rounded-full hover:scale-105 transition-medium"
              aria-label="YouTube"
            >
              <Youtube size={20} />
            </a>
          )}
          
          {socialMedia.enableFacebook && (
            <a 
              href={socialMedia.facebookUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 neu-flat rounded-full hover:scale-105 transition-medium"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
          )}
          
          <a 
            href="mailto:hello@example.com" 
            className="p-2 neu-flat rounded-full hover:scale-105 transition-medium"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
