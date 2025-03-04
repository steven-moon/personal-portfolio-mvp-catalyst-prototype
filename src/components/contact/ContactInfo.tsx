import React, { useState, useEffect } from 'react';
import NeumorphicCard from '../ui/NeumorphicCard';
import ContactInfoItem from './ContactInfoItem';
import { Mail, MapPin, Github, Linkedin, Twitter, Instagram, Youtube, LucideIcon } from 'lucide-react';
import { ContactService } from '@/lib/apiService';
import { ContactInfo as ContactInfoType } from '@/data/contactData';

// Map of icon names to icon components
const iconMap: Record<string, LucideIcon> = {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube
};

const ContactInfo = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contactData, setContactData] = useState<ContactInfoType>({
    email: "",
    location: "",
    socialMedia: []
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setIsLoading(true);
        const data = await ContactService.getContactInfo();
        setContactData(data);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, []);

  if (isLoading) {
    return (
      <NeumorphicCard className="h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neu-pressed dark:bg-zinc-700 rounded w-2/3"></div>
          <div className="h-16 bg-neu-pressed dark:bg-zinc-700 rounded w-full"></div>
          <div className="h-16 bg-neu-pressed dark:bg-zinc-700 rounded w-full"></div>
          <div className="h-16 bg-neu-pressed dark:bg-zinc-700 rounded w-full"></div>
        </div>
      </NeumorphicCard>
    );
  }
  
  const { email, location, socialMedia } = contactData;
  
  return (
    <NeumorphicCard className="h-full">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">Contact Information</h2>
      <div className="space-y-6">
        <ContactInfoItem
          icon={Mail}
          title="Email"
          content={
            <a href={`mailto:${email}`} className="text-muted-foreground hover:text-primary transition-medium">
              {email}
            </a>
          }
        />
        
        <ContactInfoItem
          icon={MapPin}
          title="Location"
          content={<p className="text-muted-foreground">{location}</p>}
        />
        
        {socialMedia.filter(item => item.enabled).map(social => {
          // Check if the icon name exists in our map, otherwise default to Github
          const Icon = iconMap[social.icon] || Github;
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
                  className="text-muted-foreground hover:text-primary transition-medium"
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
