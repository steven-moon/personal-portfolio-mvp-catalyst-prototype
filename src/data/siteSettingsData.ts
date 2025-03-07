import { SiteSettings } from '@/components/admin/settings/SettingsTypes';

// Default site settings updated for a fictional female developer
export const defaultSiteSettings: SiteSettings = {
  general: {
    siteName: 'Avery Parker Portfolio',
    authorName: 'Avery Parker',
    siteIcon: '/assets/images/logo.png',
    email: 'avery.parker@fictional.dev',
    showEmailInFooter: true,
  },
  appearance: {
    theme: 'light',
    primaryColor: '#FF78AE',
    enableAnimations: true,
    fontFamily: 'open-sans',
  },
  seo: {
    metaDescription:
      'A passionate developer dedicated to building inclusive, cutting-edge web and mobile experiences.',
    keywords: 'web developer, mobile apps, AI, portfolio, software engineering, design',
    enableSocialMetaTags: true,
    googleAnalyticsId: '',
  },
  features: {
    enableBlog: true,
    enableProjects: true,
    enableContactForm: true,
    enableNewsletter: true,
    enableMvpBanner: true,
  },
  socialMedia: {
    enableGithub: true,
    enableLinkedin: true,
    enableTwitter: true,
    enableInstagram: true,
    enableYoutube: true,
    enableFacebook: true,
    githubUrl: 'https://github.com/averyparker-fictional',
    linkedinUrl: 'https://linkedin.com/in/averyparker-fictional',
    twitterUrl: 'https://twitter.com/averycodes-fictional',
    instagramUrl: 'https://instagram.com/avery.dev-fictional',
    youtubeUrl: 'https://youtube.com/averycodes-fictional',
    facebookUrl: 'https://facebook.com/averycodes-fictional',
  },
};