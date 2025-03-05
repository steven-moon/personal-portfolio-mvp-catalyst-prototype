import React from 'react';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import { Switch } from '@/components/ui/switch';
import { SectionProps } from './SettingsTypes';
import { Info } from 'lucide-react';

const SocialMediaSettingsSection: React.FC<SectionProps> = ({ settings, handleInputChange, handleToggleChange }) => {
  return (
    <NeumorphicCard>
      <h2 className="text-xl font-semibold mb-6 text-foreground">Social Media Settings</h2>
      
      {/* Information message */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-blue-700 dark:text-blue-300 text-sm">How Social Media Links Work</h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            Social media icons will only appear in the footer when both the toggle is enabled <strong>and</strong> a valid URL is provided. 
            Empty or invalid URLs will not be displayed even if the toggle is on.
          </p>
        </div>
      </div>
      
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
  );
};

export default SocialMediaSettingsSection; 