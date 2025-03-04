
import React from 'react';
import NeumorphicCard from '../ui/NeumorphicCard';
import ContactInfoItem from './ContactInfoItem';
import { Mail, MapPin, Github, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';

// This would typically come from a context or API
// For now we'll use a static example that matches our editor
const contactData = {
  email: "hello@example.com",
  location: "San Francisco, CA",
  socialMedia: [
    { id: 'github', name: 'GitHub', icon: Github, url: 'https://github.com/johndoe', enabled: true },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/johndoe', enabled: true },
    { id: 'twitter', name: 'Twitter', icon: Twitter, url: 'https://twitter.com/johndoe', enabled: true },
    { id: 'instagram', name: 'Instagram', icon: Instagram, url: 'https://instagram.com/johndoe', enabled: true },
    { id: 'youtube', name: 'YouTube', icon: Youtube, url: 'https://youtube.com/c/johndoe', enabled: true }
  ]
};

const ContactInfo = () => {
  // In a real implementation, you would fetch this data from an API or context
  const { email, location, socialMedia } = contactData;
  
  return (
    <NeumorphicCard className="h-full">
      <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
      <div className="space-y-6">
        <ContactInfoItem
          icon={Mail}
          title="Email"
          content={
            <a href={`mailto:${email}`} className="text-neu-text-secondary hover:text-neu-accent transition-medium">
              {email}
            </a>
          }
        />
        
        <ContactInfoItem
          icon={MapPin}
          title="Location"
          content={<p className="text-neu-text-secondary">{location}</p>}
        />
        
        {socialMedia.filter(item => item.enabled).map(social => {
          const Icon = social.icon;
          return (
            <ContactInfoItem
              key={social.id}
              icon={Icon}
              title={social.name}
              content={
                <a 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neu-text-secondary hover:text-neu-accent transition-medium"
                >
                  {social.url.replace(/(https?:\/\/)?(www\.)?/, '')}
                </a>
              }
            />
          );
        })}
      </div>
    </NeumorphicCard>
  );
};

export default ContactInfo;
