import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { Switch } from '@/components/ui/switch';
import { Save, Mail, MapPin, Linkedin, Github, Twitter, Instagram, Youtube, LucideIcon } from 'lucide-react';
import { ContactService } from '@/lib/apiService';
import { ContactInfo } from '@/data/contactData';

// Map of icon names to icon components
const iconMap: Record<string, LucideIcon> = {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube
};

// Extended social media type for internal use with LucideIcon
interface SocialMediaWithComponent extends Omit<ContactInfo['socialMedia'][0], 'icon'> {
  icon: LucideIcon;
}

const ContactEditor = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState<Omit<ContactInfo, 'socialMedia'>>({
    email: "",
    location: ""
  });

  const [socialMedia, setSocialMedia] = useState<SocialMediaWithComponent[]>([]);

  // Fetch contact data when component mounts
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setIsLoading(true);
        const data = await ContactService.getContactInfo();
        
        setContactInfo({
          email: data.email,
          location: data.location
        });
        
        // Convert string icon names to actual components
        const socialMediaWithComponents = data.socialMedia.map(social => ({
          ...social,
          icon: iconMap[social.icon] || Github // Default to Github if icon not found
        }));
        
        setSocialMedia(socialMediaWithComponents);
      } catch (error) {
        console.error('Error fetching contact data:', error);
        toast.error('Failed to load contact information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const handleSocialMediaToggle = (id: string) => {
    setSocialMedia(prevSocialMedia => 
      prevSocialMedia.map(item => 
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleSocialMediaUrlChange = (id: string, url: string) => {
    setSocialMedia(prevSocialMedia => 
      prevSocialMedia.map(item => 
        item.id === id ? { ...item, url } : item
      )
    );
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Convert icon components back to string names for API
      const socialMediaForApi = socialMedia.map(social => {
        // Find the name of the icon by comparing with our iconMap
        const iconName = Object.entries(iconMap).find(([_, component]) => 
          component === social.icon
        )?.[0] || 'Github';
        
        return {
          ...social,
          icon: iconName
        };
      });
      
      const updatedContactData: ContactInfo = {
        ...contactInfo,
        socialMedia: socialMediaForApi
      };
      
      await ContactService.updateContactInfo(updatedContactData);
      toast.success("Contact information updated successfully!");
    } catch (error) {
      console.error('Error saving contact data:', error);
      toast.error('Failed to update contact information');
    }
  };

  if (isLoading) {
    return <div className="container py-12 mx-auto">Loading contact information...</div>;
  }

  return (
    <div className="container py-12 mx-auto page-transition bg-background">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Contact Page Editor</h1>
        <NeumorphicButton 
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          <Save size={18} />
          Save Changes
        </NeumorphicButton>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <NeumorphicCard>
          <h2 className="text-xl font-semibold mb-6 text-foreground">Contact Information</h2>
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="flex items-start">
              <div className="p-3 neu-pressed dark:shadow-dark-neu-pressed rounded-lg mr-4">
                <Mail className="text-primary" size={20} />
              </div>
              <div className="flex-grow">
                <label className="block text-muted-foreground mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={contactInfo.email}
                  onChange={handleInfoChange}
                  className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-3 neu-pressed dark:shadow-dark-neu-pressed rounded-lg mr-4">
                <MapPin className="text-primary" size={20} />
              </div>
              <div className="flex-grow">
                <label className="block text-muted-foreground mb-2">Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={contactInfo.location}
                  onChange={handleInfoChange}
                  className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>
        </NeumorphicCard>
        
        <NeumorphicCard>
          <h2 className="text-xl font-semibold mb-6 text-foreground">Social Media Links</h2>
          
          <div className="space-y-6">
            {socialMedia.map((social) => (
              <div key={social.id} className="flex items-start neu-flat dark:shadow-dark-neu-flat p-4 rounded-lg">
                <div className="p-3 neu-pressed dark:shadow-dark-neu-pressed rounded-lg mr-4">
                  <social.icon className="text-primary" size={20} />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-foreground font-medium">{social.name}</label>
                    <Switch 
                      checked={social.enabled} 
                      onCheckedChange={() => handleSocialMediaToggle(social.id)} 
                    />
                  </div>
                  <input 
                    type="url" 
                    value={social.url}
                    onChange={(e) => handleSocialMediaUrlChange(social.id, e.target.value)}
                    className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed text-foreground bg-transparent"
                    placeholder={`https://${social.name.toLowerCase()}.com/username`}
                    disabled={!social.enabled}
                  />
                </div>
              </div>
            ))}
          </div>
        </NeumorphicCard>
      </div>
    </div>
  );
};

export default ContactEditor;
