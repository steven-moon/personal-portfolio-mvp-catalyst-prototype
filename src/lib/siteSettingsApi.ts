import { SiteSettings } from '@/components/admin/settings/SettingsTypes';
import { apiGet, apiPut } from './api';
import { 
  getMockSiteSettings, 
  saveMockSiteSettings, 
  updateMockSiteSettingsSection, 
  resetMockSiteSettings 
} from './mockApi/siteSettingsMockApi';

const SETTINGS_ENDPOINT = '/settings';

// Flag to determine if we should use the mock API or the real API
// In a real implementation, this could be based on environment variables
const USE_MOCK_API = true;

/**
 * Fetch the current site settings
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (USE_MOCK_API) {
    return getMockSiteSettings();
  }
  return apiGet<SiteSettings>(SETTINGS_ENDPOINT);
}

/**
 * Update the site settings
 */
export async function updateSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
  if (USE_MOCK_API) {
    return saveMockSiteSettings(settings);
  }
  return apiPut<SiteSettings, SiteSettings>(SETTINGS_ENDPOINT, settings);
}

/**
 * Update a specific section of the site settings
 */
export async function updateSiteSettingsSection(
  section: keyof SiteSettings, 
  data: SiteSettings[keyof SiteSettings]
): Promise<SiteSettings> {
  if (USE_MOCK_API) {
    return updateMockSiteSettingsSection(section, data);
  }
  return apiPut<SiteSettings, Partial<SiteSettings>>(
    `${SETTINGS_ENDPOINT}/${section}`, 
    { [section]: data }
  );
}

/**
 * Reset site settings to defaults
 */
export async function resetSiteSettings(): Promise<SiteSettings> {
  if (USE_MOCK_API) {
    return resetMockSiteSettings();
  }
  return apiPut<SiteSettings, { reset: boolean }>(
    `${SETTINGS_ENDPOINT}/reset`, 
    { reset: true }
  );
} 