
import React from 'react';
import NeumorphicCard from '../ui/NeumorphicCard';
import ContactInfoItem from './ContactInfoItem';
import { Mail, MapPin, Github, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';

const ContactInfo = () => {
  return (
    <NeumorphicCard className="h-full">
      <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
      <div className="space-y-6">
        <ContactInfoItem
          icon={Mail}
          title="Email"
          content={
            <a href="mailto:hello@example.com" className="text-neu-text-secondary hover:text-neu-accent transition-medium">
              hello@example.com
            </a>
          }
        />
        
        <ContactInfoItem
          icon={MapPin}
          title="Location"
          content={<p className="text-neu-text-secondary">San Francisco, CA</p>}
        />
        
        <ContactInfoItem
          icon={Github}
          title="GitHub"
          content={
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neu-text-secondary hover:text-neu-accent transition-medium"
            >
              github.com/johndoe
            </a>
          }
        />
        
        <ContactInfoItem
          icon={Linkedin}
          title="LinkedIn"
          content={
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neu-text-secondary hover:text-neu-accent transition-medium"
            >
              linkedin.com/in/johndoe
            </a>
          }
        />

        <ContactInfoItem
          icon={Twitter}
          title="Twitter"
          content={
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neu-text-secondary hover:text-neu-accent transition-medium"
            >
              twitter.com/johndoe
            </a>
          }
        />

        <ContactInfoItem
          icon={Instagram}
          title="Instagram"
          content={
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neu-text-secondary hover:text-neu-accent transition-medium"
            >
              instagram.com/johndoe
            </a>
          }
        />

        <ContactInfoItem
          icon={Youtube}
          title="YouTube"
          content={
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neu-text-secondary hover:text-neu-accent transition-medium"
            >
              youtube.com/c/johndoe
            </a>
          }
        />
      </div>
    </NeumorphicCard>
  );
};

export default ContactInfo;
