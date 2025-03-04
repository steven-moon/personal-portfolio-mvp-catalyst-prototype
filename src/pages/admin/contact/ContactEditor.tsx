
import React, { useState } from 'react';
import { toast } from "sonner";
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { Switch } from '@/components/ui/switch';
import { Save, Mail, MapPin, Linkedin, Github, Twitter, Instagram, Youtube } from 'lucide-react';

interface SocialMediaOption {
  id: string;
  name: string;
  icon: React.ElementType;
  url: string;
  enabled: boolean;
}

const ContactEditor = () => {
  const [contactInfo, setContactInfo] = useState({
    email: "hello@example.com",
    location: "San Francisco, CA"
  });

  const [socialMedia, setSocialMedia] = useState<SocialMediaOption[]>([
    { id: 'github', name: 'GitHub', icon: Github, url: 'https://github.com/johndoe', enabled: true },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/johndoe', enabled: true },
    { id: 'twitter', name: 'Twitter', icon: Twitter, url: 'https://twitter.com/johndoe', enabled: true },
    { id: 'instagram', name: 'Instagram', icon: Instagram, url: 'https://instagram.com/johndoe', enabled: true },
    { id: 'youtube', name: 'YouTube', icon: Youtube, url: 'https://youtube.com/c/johndoe', enabled: true }
  ]);

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

  const handleSave = () => {
    // In a real implementation, this would save to a backend
    toast.success("Contact information updated successfully!");
    
    // Log the data that would be saved
    console.log("Contact info saved:", {
      contactInfo,
      socialMedia: socialMedia.filter(item => item.enabled)
    });
  };

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
