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

// Mock contact data
export const CONTACT_DATA: ContactInfo = {
  email: "hello@example.com",
  location: "San Francisco, CA",
  socialMedia: [
    { id: 'github', name: 'GitHub', icon: 'Github', url: 'https://github.com/johndoe', enabled: true },
    { id: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', url: 'https://linkedin.com/in/johndoe', enabled: true },
    { id: 'twitter', name: 'Twitter', icon: 'Twitter', url: 'https://twitter.com/johndoe', enabled: true },
    { id: 'instagram', name: 'Instagram', icon: 'Instagram', url: 'https://instagram.com/johndoe', enabled: true },
    { id: 'youtube', name: 'YouTube', icon: 'Youtube', url: 'https://youtube.com/c/johndoe', enabled: true }
  ]
}; 