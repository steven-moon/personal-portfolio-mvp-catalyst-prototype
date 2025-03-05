import React from 'react';

export interface SiteSettings {
  general: {
    siteName: string;
    authorName: string;
    siteIcon: string;
    email: string;
    showEmailInFooter: boolean;
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

export interface SectionProps {
  settings: SiteSettings;
  handleInputChange: (section: keyof SiteSettings, field: string, value: string | boolean) => void;
  handleToggleChange: (section: keyof SiteSettings, field: string) => void;
}

export interface TabButtonProps {
  tab: 'general' | 'appearance' | 'seo' | 'features' | 'socialMedia' | 'security' | 'profile';
  current: string;
  icon: React.ElementType;
  label: string;
  onClick: (tab: 'general' | 'appearance' | 'seo' | 'features' | 'socialMedia' | 'security' | 'profile') => void;
}

export const colorOptions = [
  { id: 'indigo', color: '#9b87f5', name: 'Indigo' },
  { id: 'blue', color: '#0EA5E9', name: 'Blue' },
  { id: 'purple', color: '#8B5CF6', name: 'Purple' },
  { id: 'pink', color: '#D946EF', name: 'Pink' },
  { id: 'orange', color: '#F97316', name: 'Orange' },
  { id: 'green', color: '#10B981', name: 'Green' },
];

export const fontOptions = [
  { id: 'inter', name: 'Inter (Default)' },
  { id: 'poppins', name: 'Poppins' },
  { id: 'roboto', name: 'Roboto' },
  { id: 'montserrat', name: 'Montserrat' },
  { id: 'open-sans', name: 'Open Sans' },
]; 