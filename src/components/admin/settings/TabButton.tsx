import React from 'react';
import { TabButtonProps } from './SettingsTypes';

const TabButton: React.FC<TabButtonProps> = ({ tab, current, icon: Icon, label, onClick }) => (
  <button
    onClick={() => onClick(tab)}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-medium ${
      current === tab 
        ? 'bg-neu-accent text-white' 
        : 'hover:bg-background hover:shadow-neu-pressed dark:hover:shadow-dark-neu-pressed'
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

export default TabButton; 