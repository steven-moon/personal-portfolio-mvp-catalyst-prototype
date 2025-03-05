import { SiteSettings } from '@/components/admin/settings/SettingsTypes';

// Default site settings
export const defaultSiteSettings: SiteSettings = {
  general: {
    siteName: 'Steven Moon Portfolio',
    authorName: 'Steven Moon',
    siteIcon: '',
    email: 'steven@clevercoding.com',
    showEmailInFooter: true,
  },
  appearance: {
    theme: 'light',
    primaryColor: '#9b87f5',
    enableAnimations: true,
    fontFamily: 'inter',
  },
  seo: {
    metaDescription: 'Personal portfolio website with projects, blog, and contact information',
    keywords: 'portfolio, web development, design, projects',
    enableSocialMetaTags: true,
    googleAnalyticsId: '',
  },
  features: {
    enableBlog: true,
    enableProjects: true,
    enableContactForm: true,
    enableNewsletter: false,
  },
  socialMedia: {
    enableGithub: true,
    enableLinkedin: true,
    enableTwitter: false,
    enableInstagram: false,
    enableYoutube: false,
    enableFacebook: false,
    githubUrl: 'https://github.com/steven-moon',
    linkedinUrl: 'https://linkedin.com/in/stevenmoon',
    twitterUrl: 'https://twitter.com/stevenmoon',
    instagramUrl: 'https://instagram.com/',
    youtubeUrl: 'https://youtube.com',
    facebookUrl: 'https://facebook.com',
  },
}; 