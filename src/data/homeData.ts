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
  }
}

// Default profile image
const DEFAULT_PROFILE_IMAGE = "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&auto=format";

// Home page data
export const HOME_DATA: HomePage = {
  hero: {
    title: "Jane Doe",
    subtitle: "Creating beautiful digital experiences with attention to detail",
    profession: "Frontend Developer",
    profileImage: DEFAULT_PROFILE_IMAGE,
    services: [
      {
        id: "1",
        title: "UI/UX Design",
        description: "Creating intuitive and beautiful user interfaces."
      },
      {
        id: "2",
        title: "Web Development",
        description: "Building responsive and performant websites."
      },
      {
        id: "3",
        title: "Mobile Apps",
        description: "Developing cross-platform mobile experiences."
      }
    ]
  }
}; 