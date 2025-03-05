import { SiteSettings } from '@/components/admin/settings/SettingsTypes';
import { defaultSiteSettings } from '@/data/siteSettingsData';

// Key for storing settings in localStorage
const SETTINGS_STORAGE_KEY = 'portfolio_site_settings';

/**
 * Get site settings from localStorage, or return defaults if not found
 */
export async function getMockSiteSettings(): Promise<SiteSettings> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    
    if (storedSettings) {
      return JSON.parse(storedSettings) as SiteSettings;
    }
    
    // If no settings found, save and return defaults
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSiteSettings));
    return defaultSiteSettings;
  } catch (error) {
    console.error('Error retrieving settings from localStorage:', error);
    return defaultSiteSettings;
  }
}

/**
 * Save site settings to localStorage
 */
export async function saveMockSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return settings;
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
    throw new Error('Failed to save settings');
  }
}

/**
 * Update a specific section of the site settings
 */
export async function updateMockSiteSettingsSection(
  section: keyof SiteSettings, 
  data: SiteSettings[keyof SiteSettings]
): Promise<SiteSettings> {
  const currentSettings = await getMockSiteSettings();
  
  const updatedSettings = {
    ...currentSettings,
    [section]: data
  };
  
  return saveMockSiteSettings(updatedSettings);
}

/**
 * Reset site settings to defaults
 */
export async function resetMockSiteSettings(): Promise<SiteSettings> {
  await new Promise(resolve => setTimeout(resolve, 500));
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSiteSettings));
  return defaultSiteSettings;
} 