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

// Home page data
export const HOME_DATA: HomePage = {
  hero: {
    title: "John Doe",
    subtitle: "Creating beautiful digital experiences with attention to detail",
    profession: "Frontend Developer",
    profileImage: "/images/profile.jpg",
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