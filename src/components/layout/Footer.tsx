import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-neu-text-secondary">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 neu-flat rounded-full hover:scale-105 transition-medium"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 neu-flat rounded-full hover:scale-105 transition-medium"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
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
