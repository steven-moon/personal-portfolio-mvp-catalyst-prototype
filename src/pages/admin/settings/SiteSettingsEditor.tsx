import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { Switch } from '@/components/ui/switch';
import { Save, Palette, Globe, Moon, Bot, Info, Share2, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

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
  socialMedia: {
    enableGithub: boolean;
    enableLinkedin: boolean;
    enableTwitter: boolean;
    enableInstagram: boolean;
    enableYoutube: boolean;
    enableFacebook: boolean;
    githubUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
    facebookUrl: string;
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
  const { theme, toggleTheme } = useTheme();
  
  // Initialize with default settings
  const [settings, setSettings] = useState<SiteSettings>({
    general: {
      siteName: 'My Portfolio',
      siteDescription: 'A personal portfolio website showcasing my work and skills',
      authorName: 'Jane Doe',
      favicon: '/favicon.ico',
    },
    appearance: {
      theme: 'light', // Default, will be synced with current theme on component mount
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
    socialMedia: {
      enableGithub: true,
      enableLinkedin: true,
      enableTwitter: false,
      enableInstagram: false,
      enableYoutube: false,
      enableFacebook: false,
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
      twitterUrl: 'https://twitter.com',
      instagramUrl: 'https://instagram.com',
      youtubeUrl: 'https://youtube.com',
      facebookUrl: 'https://facebook.com',
    },
  });

  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'seo' | 'features' | 'socialMedia'>('general');

  // Sync settings with current theme on component mount
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: theme as 'light' | 'dark'
      }
    }));
  }, []);

  const handleInputChange = (
    section: keyof SiteSettings, 
    field: string, 
    value: string | boolean
  ) => {
    // Special handling for theme change to update the actual theme
    if (section === 'appearance' && field === 'theme') {
      // If changing from light to dark or vice versa, toggle the theme
      if ((theme === 'light' && value === 'dark') || (theme === 'dark' && value === 'light')) {
        toggleTheme();
      }
      // For system preference, we'd need additional logic to detect and apply system preference
      // This is simplified for now
    }
    
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
    setSettings(prev => {
      const sectionData = prev[section];
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: !sectionData[field as keyof typeof sectionData]
        }
      };
    });
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
    tab: 'general' | 'appearance' | 'seo' | 'features' | 'socialMedia'; 
    current: string; 
    icon: React.ElementType; 
    label: string 
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-medium ${
        activeTab === tab 
          ? 'bg-neu-accent text-white' 
          : 'hover:bg-background hover:shadow-neu-pressed dark:hover:shadow-dark-neu-pressed'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="container py-12 mx-auto page-transition">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Site Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible mb-4 md:mb-0">
          <TabButton tab="general" current={activeTab} icon={Info} label="General" />
          <TabButton tab="appearance" current={activeTab} icon={Palette} label="Appearance" />
          <TabButton tab="seo" current={activeTab} icon={Globe} label="SEO" />
          <TabButton tab="features" current={activeTab} icon={Bot} label="Features" />
          <TabButton tab="socialMedia" current={activeTab} icon={Share2} label="Social Media" />
        </div>
        
        <div className="flex-1">
          {activeTab === 'general' && (
            <NeumorphicCard>
              <h2 className="text-xl font-semibold mb-6 text-foreground">General Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Site Name</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                    className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Site Description</label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                    className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none h-24 text-foreground"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Author Name</label>
                  <input
                    type="text"
                    value={settings.general.authorName}
                    onChange={(e) => handleInputChange('general', 'authorName', e.target.value)}
                    className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Favicon URL</label>
                  <input
                    type="text"
                    value={settings.general.favicon}
                    onChange={(e) => handleInputChange('general', 'favicon', e.target.value)}
                    className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                  />
                </div>
              </div>
            </NeumorphicCard>
          )}
          
          {activeTab === 'appearance' && (
            <NeumorphicCard>
              <h2 className="text-xl font-semibold mb-6 text-foreground">Appearance Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">Theme</label>
                  <div className="flex flex-wrap gap-4">
                    {(['light', 'dark', 'system'] as const).map(themeOption => (
                      <label 
                        key={themeOption}
                        className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-medium ${
                          settings.appearance.theme === themeOption 
                            ? 'bg-primary text-white' 
                            : 'neu-flat dark:shadow-dark-neu-flat hover:shadow-neu-convex dark:hover:shadow-dark-neu-convex'
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
                        {themeOption === 'light' && <Sun size={18} />}
                        {themeOption === 'dark' && <Moon size={18} />}
                        {themeOption === 'system' && <Monitor size={18} />}
                        <span className="capitalize">{themeOption}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">Primary Color</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {colorOptions.map(color => (
                      <div 
                        key={color.id}
                        onClick={() => handleInputChange('appearance', 'primaryColor', color.color)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-medium ${
                          settings.appearance.primaryColor === color.color
                            ? 'shadow-neu-pressed dark:shadow-dark-neu-pressed'
                            : 'neu-flat dark:shadow-dark-neu-flat hover:shadow-neu-convex dark:hover:shadow-dark-neu-convex'
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700"
                          style={{ backgroundColor: color.color }}
                        />
                        <span className="text-xs text-foreground">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">Font Family</label>
                  <select
                    value={settings.appearance.fontFamily}
                    onChange={(e) => handleInputChange('appearance', 'fontFamily', e.target.value)}
                    className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                  >
                    {fontOptions.map(font => (
                      <option key={font.id} value={font.id}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">Enable Animations</h3>
                    <p className="text-sm text-muted-foreground">Toggle page transitions and other UI animations</p>
                  </div>
                  <Switch 
                    checked={settings.appearance.enableAnimations}
                    onCheckedChange={() => handleToggleChange('appearance', 'enableAnimations')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </NeumorphicCard>
          )}
          
          {activeTab === 'seo' && (
            <NeumorphicCard>
              <h2 className="text-xl font-semibold mb-6 text-foreground">SEO Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Meta Description</label>
                  <textarea
                    value={settings.seo.metaDescription}
                    onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
                    className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none h-24 text-foreground"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Keywords</label>
                  <input
                    type="text"
                    value={settings.seo.keywords}
                    onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
                    className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                    placeholder="comma, separated, keywords"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Google Analytics ID</label>
                  <input
                    type="text"
                    value={settings.seo.googleAnalyticsId}
                    onChange={(e) => handleInputChange('seo', 'googleAnalyticsId', e.target.value)}
                    className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">Enable Social Media Meta Tags</h3>
                    <p className="text-sm text-muted-foreground">Optimize sharing on social platforms</p>
                  </div>
                  <Switch 
                    checked={settings.seo.enableSocialMetaTags}
                    onCheckedChange={() => handleToggleChange('seo', 'enableSocialMetaTags')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </NeumorphicCard>
          )}
          
          {activeTab === 'features' && (
            <NeumorphicCard>
              <h2 className="text-xl font-semibold mb-6 text-foreground">Feature Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">Enable Blog</h3>
                    <p className="text-sm text-muted-foreground">Show blog section on your website</p>
                  </div>
                  <Switch 
                    checked={settings.features.enableBlog}
                    onCheckedChange={() => handleToggleChange('features', 'enableBlog')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">Enable Projects</h3>
                    <p className="text-sm text-muted-foreground">Show projects section on your website</p>
                  </div>
                  <Switch 
                    checked={settings.features.enableProjects}
                    onCheckedChange={() => handleToggleChange('features', 'enableProjects')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">Enable Contact Form</h3>
                    <p className="text-sm text-muted-foreground">Allow visitors to contact you directly</p>
                  </div>
                  <Switch 
                    checked={settings.features.enableContactForm}
                    onCheckedChange={() => handleToggleChange('features', 'enableContactForm')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">Enable Newsletter</h3>
                    <p className="text-sm text-muted-foreground">Add newsletter subscription option</p>
                  </div>
                  <Switch 
                    checked={settings.features.enableNewsletter}
                    onCheckedChange={() => handleToggleChange('features', 'enableNewsletter')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </NeumorphicCard>
          )}
          
          {activeTab === 'socialMedia' && (
            <NeumorphicCard>
              <h2 className="text-xl font-semibold mb-6 text-foreground">Social Media Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">GitHub</h3>
                    <p className="text-sm text-muted-foreground">Show GitHub link in footer</p>
                  </div>
                  <Switch 
                    checked={settings.socialMedia.enableGithub}
                    onCheckedChange={() => handleToggleChange('socialMedia', 'enableGithub')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                {settings.socialMedia.enableGithub && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">GitHub URL</label>
                    <input
                      type="text"
                      value={settings.socialMedia.githubUrl}
                      onChange={(e) => handleInputChange('socialMedia', 'githubUrl', e.target.value)}
                      className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">LinkedIn</h3>
                    <p className="text-sm text-muted-foreground">Show LinkedIn link in footer</p>
                  </div>
                  <Switch 
                    checked={settings.socialMedia.enableLinkedin}
                    onCheckedChange={() => handleToggleChange('socialMedia', 'enableLinkedin')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                {settings.socialMedia.enableLinkedin && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">LinkedIn URL</label>
                    <input
                      type="text"
                      value={settings.socialMedia.linkedinUrl}
                      onChange={(e) => handleInputChange('socialMedia', 'linkedinUrl', e.target.value)}
                      className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">Twitter</h3>
                    <p className="text-sm text-muted-foreground">Show Twitter link in footer</p>
                  </div>
                  <Switch 
                    checked={settings.socialMedia.enableTwitter}
                    onCheckedChange={() => handleToggleChange('socialMedia', 'enableTwitter')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                {settings.socialMedia.enableTwitter && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Twitter URL</label>
                    <input
                      type="text"
                      value={settings.socialMedia.twitterUrl}
                      onChange={(e) => handleInputChange('socialMedia', 'twitterUrl', e.target.value)}
                      className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">Instagram</h3>
                    <p className="text-sm text-muted-foreground">Show Instagram link in footer</p>
                  </div>
                  <Switch 
                    checked={settings.socialMedia.enableInstagram}
                    onCheckedChange={() => handleToggleChange('socialMedia', 'enableInstagram')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                {settings.socialMedia.enableInstagram && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Instagram URL</label>
                    <input
                      type="text"
                      value={settings.socialMedia.instagramUrl}
                      onChange={(e) => handleInputChange('socialMedia', 'instagramUrl', e.target.value)}
                      className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">YouTube</h3>
                    <p className="text-sm text-muted-foreground">Show YouTube link in footer</p>
                  </div>
                  <Switch 
                    checked={settings.socialMedia.enableYoutube}
                    onCheckedChange={() => handleToggleChange('socialMedia', 'enableYoutube')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                {settings.socialMedia.enableYoutube && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">YouTube URL</label>
                    <input
                      type="text"
                      value={settings.socialMedia.youtubeUrl}
                      onChange={(e) => handleInputChange('socialMedia', 'youtubeUrl', e.target.value)}
                      className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">Facebook</h3>
                    <p className="text-sm text-muted-foreground">Show Facebook link in footer</p>
                  </div>
                  <Switch 
                    checked={settings.socialMedia.enableFacebook}
                    onCheckedChange={() => handleToggleChange('socialMedia', 'enableFacebook')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                {settings.socialMedia.enableFacebook && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Facebook URL</label>
                    <input
                      type="text"
                      value={settings.socialMedia.facebookUrl}
                      onChange={(e) => handleInputChange('socialMedia', 'facebookUrl', e.target.value)}
                      className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                    />
                  </div>
                )}
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
