import React from 'react';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import { Switch } from '@/components/ui/switch';
import { SectionProps } from './SettingsTypes';
import { Info } from 'lucide-react';

const FeaturesSettingsSection: React.FC<SectionProps> = ({ settings, handleToggleChange }) => {
  return (
    <NeumorphicCard>
      <h2 className="text-xl font-semibold mb-6 text-foreground">Feature Settings</h2>
      
      <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg flex items-start">
        <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">Navigation Visibility Control</p>
          <p className="text-xs mt-1">These toggles control the visibility of corresponding sections in your site navigation. Changes take effect immediately after saving.</p>
        </div>
      </div>
      
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
            <p className="text-sm text-muted-foreground">Show newsletter subscription form in the footer</p>
          </div>
          <Switch 
            checked={settings.features.enableNewsletter}
            onCheckedChange={() => handleToggleChange('features', 'enableNewsletter')}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        
        <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
          <div>
            <h3 className="font-medium text-foreground">Enable MVP Banner</h3>
            <p className="text-sm text-muted-foreground">Show MVP Catalyst demo banner at the top of the site</p>
          </div>
          <Switch 
            checked={settings.features.enableMvpBanner}
            onCheckedChange={() => handleToggleChange('features', 'enableMvpBanner')}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>
    </NeumorphicCard>
  );
};

export default FeaturesSettingsSection; 