export interface HomePage {
  hero: {
    title: string;
    subtitle: string;
    profession: string;
    profileImage?: string;
    services: {
      id: string;
      title: string;
      description: string;
    }[];
  };
}

// You can replace this image URL with any other placeholder or real image URL
const DEFAULT_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1554692938-6556a1d4d16d?q=80&auto=format";

// Home page data adapted for a fictional female developer named Avery Parker
export const HOME_DATA: HomePage = {
  hero: {
    title: "Avery Parker",
    subtitle: "Building inclusive, next-generation web and AI solutions",
    profession: "Full-Stack & AI Developer",
    profileImage: DEFAULT_PROFILE_IMAGE,
    services: [
      {
        id: "1",
        title: "End-to-End Web Development",
        description:
          "Creating user-friendly, performance-driven solutions with React, Node, and beyond."
      },
      {
        id: "2",
        title: "AI-driven Innovation",
        description:
          "Designing AI-based features for chatbots, predictive analytics, and data-driven experiences."
      },
      {
        id: "3",
        title: "Blockchain Integrations",
        description:
          "Implementing secure, decentralized functionalities with Ethereum, Solidity, and more."
      }
    ]
  }
};