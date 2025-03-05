import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteSettings } from '@/components/admin/settings/SettingsTypes';
import { getSiteSettings } from '@/lib/siteSettingsApi';
import { defaultSiteSettings } from '@/data/siteSettingsData';

interface SiteSettingsContextType {
  siteSettings: SiteSettings;
  loading: boolean;
  error: Error | null;
  reloadSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider: React.FC<SiteSettingsProviderProps> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSiteSettings();
      setSiteSettings(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      setError(error instanceof Error ? error : new Error('An unknown error occurred'));
      // Use default settings if API fails
      setSiteSettings(defaultSiteSettings);
    } finally {
      setLoading(false);
    }
  };

  // Initial load of settings
  useEffect(() => {
    fetchSettings();
  }, []);

  // Public method to reload settings
  const reloadSettings = async () => {
    await fetchSettings();
  };

  const value = {
    siteSettings,
    loading,
    error,
    reloadSettings
  };

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}; 