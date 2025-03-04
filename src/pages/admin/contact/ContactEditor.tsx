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
    <div className="container py-12 mx-auto page-transition">
      <h1 className="text-3xl font-bold mb-8 text-neu-accent">Contact Page Editor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <NeumorphicCard>
          <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="flex">
                <div className="p-2 neu-pressed rounded-l-lg">
                  <Mail className="text-neu-accent" size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={contactInfo.email}
                  onChange={handleInfoChange}
                  className="flex-1 p-2 bg-neu-bg shadow-neu-pressed rounded-r-lg focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <div className="flex">
                <div className="p-2 neu-pressed rounded-l-lg">
                  <MapPin className="text-neu-accent" size={20} />
                </div>
                <input
                  type="text"
                  name="location"
                  value={contactInfo.location}
                  onChange={handleInfoChange}
                  className="flex-1 p-2 bg-neu-bg shadow-neu-pressed rounded-r-lg focus:outline-none"
                />
              </div>
            </div>
          </div>
        </NeumorphicCard>
        
        <NeumorphicCard>
          <h2 className="text-xl font-semibold mb-6">Social Media</h2>
          <p className="text-neu-text-secondary mb-4">Toggle which social media links to display on your contact page.</p>
          
          <div className="space-y-4">
            {socialMedia.map((social) => {
              const Icon = social.icon;
              return (
                <div key={social.id} className="p-4 neu-flat rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 neu-pressed rounded-lg">
                        <Icon className="text-neu-accent" size={18} />
                      </div>
                      <span className="font-medium">{social.name}</span>
                    </div>
                    
                    <Switch 
                      checked={social.enabled}
                      onCheckedChange={() => handleSocialMediaToggle(social.id)}
                      className="data-[state=checked]:bg-neu-accent"
                    />
                  </div>
                  
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) => handleSocialMediaUrlChange(social.id, e.target.value)}
                    className={`w-full p-2 bg-neu-bg rounded-lg transition-all ${social.enabled ? 'shadow-neu-pressed opacity-100' : 'shadow-none opacity-50'}`}
                    disabled={!social.enabled}
                  />
                </div>
              );
            })}
          </div>
        </NeumorphicCard>
      </div>
      
      <div className="flex justify-end">
        <NeumorphicButton 
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          <Save size={18} />
          Save Changes
        </NeumorphicButton>
      </div>
    </div>
  );
};

export default ContactEditor;
