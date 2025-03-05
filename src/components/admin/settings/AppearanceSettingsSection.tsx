import React from 'react';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon, Monitor } from 'lucide-react';
import { SectionProps, colorOptions, fontOptions } from './SettingsTypes';

const AppearanceSettingsSection: React.FC<SectionProps> = ({ settings, handleInputChange, handleToggleChange }) => {
  return (
    <NeumorphicCard>
      <h2 className="text-xl font-semibold mb-6 text-foreground">Appearance Settings</h2>
      <div className="mb-6 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
        <p className="text-sm font-medium">Not Functional</p>
      </div>
      
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
  );
};

export default AppearanceSettingsSection; 