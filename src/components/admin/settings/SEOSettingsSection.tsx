import React from 'react';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import { Switch } from '@/components/ui/switch';
import { SectionProps } from './SettingsTypes';

const SEOSettingsSection: React.FC<SectionProps> = ({ settings, handleInputChange, handleToggleChange }) => {
  return (
    <NeumorphicCard>
      <h2 className="text-xl font-semibold mb-6 text-foreground">SEO Settings</h2>
      <div className="mb-6 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
        <p className="text-sm font-medium">Not Functional</p>
      </div>
      
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
  );
};

export default SEOSettingsSection; 