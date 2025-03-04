
import React, { useState } from 'react';
import { toast } from "sonner";
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { Switch } from '@/components/ui/switch';
import { Save, Palette, Globe, Moon, Bot, Info } from 'lucide-react';

// Define the site settings types
interface SiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    authorName: string;
    favicon: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
    enableAnimations: boolean;
    fontFamily: string;
  };
  seo: {
    metaDescription: string;
    keywords: string;
    enableSocialMetaTags: boolean;
    googleAnalyticsId: string;
  };
  features: {
    enableBlog: boolean;
    enableProjects: boolean;
    enableContactForm: boolean;
    enableNewsletter: boolean;
  };
}

const colorOptions = [
  { id: 'indigo', color: '#9b87f5', name: 'Indigo' },
  { id: 'blue', color: '#0EA5E9', name: 'Blue' },
  { id: 'purple', color: '#8B5CF6', name: 'Purple' },
  { id: 'pink', color: '#D946EF', name: 'Pink' },
  { id: 'orange', color: '#F97316', name: 'Orange' },
  { id: 'green', color: '#10B981', name: 'Green' },
];

const fontOptions = [
  { id: 'inter', name: 'Inter (Default)' },
  { id: 'poppins', name: 'Poppins' },
  { id: 'roboto', name: 'Roboto' },
  { id: 'montserrat', name: 'Montserrat' },
  { id: 'open-sans', name: 'Open Sans' },
];

const SiteSettingsEditor = () => {
  // Initialize with default settings
  const [settings, setSettings] = useState<SiteSettings>({
    general: {
      siteName: 'My Portfolio',
      siteDescription: 'A personal portfolio website showcasing my work and skills',
      authorName: 'John Doe',
      favicon: '/favicon.ico',
    },
    appearance: {
      theme: 'light',
      primaryColor: '#9b87f5',
      enableAnimations: true,
      fontFamily: 'inter',
    },
    seo: {
      metaDescription: 'Personal portfolio website with projects, blog, and contact information',
      keywords: 'portfolio, web development, design, projects',
      enableSocialMetaTags: true,
      googleAnalyticsId: '',
    },
    features: {
      enableBlog: true,
      enableProjects: true,
      enableContactForm: true,
      enableNewsletter: false,
    },
  });

  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'seo' | 'features'>('general');

  const handleInputChange = (
    section: keyof SiteSettings, 
    field: string, 
    value: string | boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleToggleChange = (
    section: keyof SiteSettings, 
    field: string
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field as keyof typeof prev[section]]
      }
    }));
  };

  const handleSave = () => {
    // In a real implementation, this would save to a backend
    toast.success("Site settings updated successfully!");
    
    // Log the data that would be saved
    console.log("Settings saved:", settings);
  };

  const TabButton = ({ 
    tab, 
    current, 
    icon: Icon, 
    label 
  }: { 
    tab: 'general' | 'appearance' | 'seo' | 'features'; 
    current: string; 
    icon: React.ElementType; 
    label: string 
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-medium ${
        activeTab === tab 
          ? 'bg-neu-accent text-white' 
          : 'hover:bg-neu-bg hover:shadow-neu-pressed'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="container py-12 mx-auto page-transition">
      <h1 className="text-3xl font-bold mb-8 text-neu-accent">Site Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible mb-4 md:mb-0">
          <TabButton tab="general" current={activeTab} icon={Info} label="General" />
          <TabButton tab="appearance" current={activeTab} icon={Palette} label="Appearance" />
          <TabButton tab="seo" current={activeTab} icon={Globe} label="SEO" />
          <TabButton tab="features" current={activeTab} icon={Bot} label="Features" />
        </div>
        
        <div className="flex-1">
          {activeTab === 'general' && (
            <NeumorphicCard>
              <h2 className="text-xl font-semibold mb-6">General Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                    className="w-full p-2 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Site Description</label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                    className="w-full p-2 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Author Name</label>
                  <input
                    type="text"
                    value={settings.general.authorName}
                    onChange={(e) => handleInputChange('general', 'authorName', e.target.value)}
                    className="w-full p-2 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Favicon URL</label>
                  <input
                    type="text"
                    value={settings.general.favicon}
                    onChange={(e) => handleInputChange('general', 'favicon', e.target.value)}
                    className="w-full p-2 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            </NeumorphicCard>
          )}
          
          {activeTab === 'appearance' && (
            <NeumorphicCard>
              <h2 className="text-xl font-semibold mb-6">Appearance Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Theme</label>
                  <div className="flex gap-4">
                    {(['light', 'dark', 'system'] as const).map(themeOption => (
                      <label 
                        key={themeOption}
                        className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-medium ${
                          settings.appearance.theme === themeOption 
                            ? 'bg-neu-accent text-white' 
                            : 'neu-flat hover:shadow-neu-convex'
                        }`}
                      >
                        <input
                          type="radio"
                          name="theme"
                          value={themeOption}
                          checked={settings.appearance.theme === themeOption}
                          onChange={() => handleInputChange('appearance', 'theme', themeOption)}
                          className="hidden"
                        />
                        <Moon size={18} className={themeOption === 'dark' ? 'opacity-100' : 'opacity-0'} />
                        <span className="capitalize">{themeOption}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3">Primary Color</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {colorOptions.map(color => (
                      <div 
                        key={color.id}
                        onClick={() => handleInputChange('appearance', 'primaryColor', color.color)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-medium ${
                          settings.appearance.primaryColor === color.color
                            ? 'neu-pressed'
                            : 'neu-flat hover:shadow-neu-convex'
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-white"
                          style={{ backgroundColor: color.color }}
                        />
                        <span className="text-xs">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3">Font Family</label>
                  <select
                    value={settings.appearance.fontFamily}
                    onChange={(e) => handleInputChange('appearance', 'fontFamily', e.target.value)}
                    className="w-full p-2 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none"
                  >
                    {fontOptions.map(font => (
                      <option key={font.id} value={font.id}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-4 neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium">Enable Animations</h3>
                    <p className="text-sm text-neu-text-secondary">Toggle page transitions and other UI animations</p>
                  </div>
                  <Switch 
                    checked={settings.appearance.enableAnimations}
                    onCheckedChange={() => handleToggleChange('appearance', 'enableAnimations')}
                    className="data-[state=checked]:bg-neu-accent"
                  />
                </div>
              </div>
            </NeumorphicCard>
          )}
          
          {activeTab === 'seo' && (
            <NeumorphicCard>
              <h2 className="text-xl font-semibold mb-6">SEO Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Meta Description</label>
                  <textarea
                    value={settings.seo.metaDescription}
                    onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
                    className="w-full p-2 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Keywords</label>
                  <input
                    type="text"
                    value={settings.seo.keywords}
                    onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
                    className="w-full p-2 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none"
                    placeholder="comma, separated, keywords"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Google Analytics ID</label>
                  <input
                    type="text"
                    value={settings.seo.googleAnalyticsId}
                    onChange={(e) => handleInputChange('seo', 'googleAnalyticsId', e.target.value)}
                    className="w-full p-2 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium">Enable Social Media Meta Tags</h3>
                    <p className="text-sm text-neu-text-secondary">Optimize sharing on social platforms</p>
                  </div>
                  <Switch 
                    checked={settings.seo.enableSocialMetaTags}
                    onCheckedChange={() => handleToggleChange('seo', 'enableSocialMetaTags')}
                    className="data-[state=checked]:bg-neu-accent"
                  />
                </div>
              </div>
            </NeumorphicCard>
          )}
          
          {activeTab === 'features' && (
            <NeumorphicCard>
              <h2 className="text-xl font-semibold mb-6">Feature Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium">Enable Blog</h3>
                    <p className="text-sm text-neu-text-secondary">Show blog section on your website</p>
                  </div>
                  <Switch 
                    checked={settings.features.enableBlog}
                    onCheckedChange={() => handleToggleChange('features', 'enableBlog')}
                    className="data-[state=checked]:bg-neu-accent"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium">Enable Projects</h3>
                    <p className="text-sm text-neu-text-secondary">Show projects section on your website</p>
                  </div>
                  <Switch 
                    checked={settings.features.enableProjects}
                    onCheckedChange={() => handleToggleChange('features', 'enableProjects')}
                    className="data-[state=checked]:bg-neu-accent"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium">Enable Contact Form</h3>
                    <p className="text-sm text-neu-text-secondary">Allow visitors to contact you directly</p>
                  </div>
                  <Switch 
                    checked={settings.features.enableContactForm}
                    onCheckedChange={() => handleToggleChange('features', 'enableContactForm')}
                    className="data-[state=checked]:bg-neu-accent"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium">Enable Newsletter</h3>
                    <p className="text-sm text-neu-text-secondary">Add newsletter subscription option</p>
                  </div>
                  <Switch 
                    checked={settings.features.enableNewsletter}
                    onCheckedChange={() => handleToggleChange('features', 'enableNewsletter')}
                    className="data-[state=checked]:bg-neu-accent"
                  />
                </div>
              </div>
            </NeumorphicCard>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <NeumorphicButton 
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          <Save size={18} />
          Save Settings
        </NeumorphicButton>
      </div>
    </div>
  );
};

export default SiteSettingsEditor;
