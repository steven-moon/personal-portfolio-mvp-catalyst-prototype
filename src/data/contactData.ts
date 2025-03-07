export interface ContactInfo {
  email: string;
  location: string;
  socialMedia: {
    id: string;
    name: string;
    icon: string; // Icon component reference name (used to dynamically load the right icon)
    url: string;
    enabled: boolean;
  }[];
}

// Updated contact data for a fictional female developer
export const CONTACT_DATA: ContactInfo = {
  email: "avery.parker@fictional.dev",
  location: "San Francisco, California",
  socialMedia: [
    {
      id: 'github',
      name: 'GitHub',
      icon: 'Github',
      url: 'https://github.com/averyparker-fictional',
      enabled: true
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'Linkedin',
      url: 'https://linkedin.com/in/averyparker-fictional',
      enabled: true
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: 'Twitter',
      url: 'https://twitter.com/averycodes-fictional',
      enabled: true
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'Instagram',
      url: 'https://instagram.com/avery.dev-fictional',
      enabled: true
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: 'Youtube',
      url: 'https://youtube.com/@averydev',
      enabled: false
    }
  ]
};