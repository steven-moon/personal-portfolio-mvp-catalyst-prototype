import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { Save, Palette, Globe, Bot, Info, Share2, Shield, UserCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

// Import Types
import { SiteSettings } from '@/components/admin/settings/SettingsTypes';

// Import Components
import TabButton from '@/components/admin/settings/TabButton';
import GeneralSettingsSection from '@/components/admin/settings/GeneralSettingsSection';
import AppearanceSettingsSection from '@/components/admin/settings/AppearanceSettingsSection';
import SEOSettingsSection from '@/components/admin/settings/SEOSettingsSection';
import FeaturesSettingsSection from '@/components/admin/settings/FeaturesSettingsSection';
import SocialMediaSettingsSection from '@/components/admin/settings/SocialMediaSettingsSection';
import SecuritySettingsSection from '@/components/admin/settings/SecuritySettingsSection';
import ProfileSettingsSection from '@/components/admin/settings/ProfileSettingsSection';

// Import API functions
import { getSiteSettings, updateSiteSettings } from '@/lib/siteSettingsApi';
import { defaultSiteSettings } from '@/data/siteSettingsData';

// Main Site Settings Editor Component
const SiteSettingsEditor: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { reloadSettings } = useSiteSettings();
  
  // Initialize with default settings
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'seo' | 'features' | 'socialMedia' | 'security' | 'profile'>('general');

  // Fetch settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await getSiteSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching site settings:', error);
        toast.error('Failed to load settings. Using defaults instead.');
        // Use default settings if API fails
        setSettings(defaultSiteSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

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

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSiteSettings(settings);
      
      // Reload settings in the global context to update navigation
      await reloadSettings();
      
      toast.success("Site settings updated successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-12 mx-auto page-transition">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Site Settings</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible mb-4 md:mb-0">
              <TabButton tab="profile" current={activeTab} icon={UserCircle} label="Profile" onClick={setActiveTab} />
              <TabButton tab="general" current={activeTab} icon={Info} label="General" onClick={setActiveTab} />
              <TabButton tab="security" current={activeTab} icon={Shield} label="Security" onClick={setActiveTab} />
              <TabButton tab="socialMedia" current={activeTab} icon={Share2} label="Social Media" onClick={setActiveTab} />
              <TabButton tab="features" current={activeTab} icon={Bot} label="Features" onClick={setActiveTab} />
              <TabButton tab="appearance" current={activeTab} icon={Palette} label="Appearance" onClick={setActiveTab} />
              <TabButton tab="seo" current={activeTab} icon={Globe} label="SEO" onClick={setActiveTab} />
            </div>
            
            <div className="flex-1">
              {activeTab === 'profile' && (
                <ProfileSettingsSection />
              )}
            
              {activeTab === 'general' && (
                <GeneralSettingsSection 
                  settings={settings} 
                  handleInputChange={handleInputChange} 
                  handleToggleChange={handleToggleChange} 
                />
              )}
              
              {activeTab === 'appearance' && (
                <AppearanceSettingsSection 
                  settings={settings} 
                  handleInputChange={handleInputChange} 
                  handleToggleChange={handleToggleChange} 
                />
              )}
              
              {activeTab === 'seo' && (
                <SEOSettingsSection 
                  settings={settings} 
                  handleInputChange={handleInputChange} 
                  handleToggleChange={handleToggleChange} 
                />
              )}
              
              {activeTab === 'features' && (
                <FeaturesSettingsSection 
                  settings={settings} 
                  handleToggleChange={handleToggleChange}
                  handleInputChange={handleInputChange}
                />
              )}
              
              {activeTab === 'socialMedia' && (
                <SocialMediaSettingsSection 
                  settings={settings} 
                  handleInputChange={handleInputChange} 
                  handleToggleChange={handleToggleChange} 
                />
              )}
              
              {activeTab === 'security' && (
                <SecuritySettingsSection />
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            {activeTab !== 'profile' && activeTab !== 'security' && (
              <NeumorphicButton 
                onClick={handleSave}
                className="flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Settings
                  </>
                )}
              </NeumorphicButton>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SiteSettingsEditor;
