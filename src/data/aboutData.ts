export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export interface SkillCategory {
  id?: string;
  title: string;
  skills: string[];
}

export interface AboutMeData {
  intro: {
    headline: string;
    subheadline: string;
  };
  story: string[];
  workExperience: WorkExperience[];
  education: Education[];
  skillCategories: SkillCategory[];
  values: {
    id: string;
    title: string;
    description: string;
  }[];
}

// Mock about me data
export const ABOUT_DATA: AboutMeData = {
  intro: {
    headline: "About Me",
    subheadline: "I'm a passionate developer with a keen eye for design and a love for creating intuitive, beautiful digital experiences."
  },
  story: [
    "With over 5 years of experience in web development, I've had the opportunity to work on a diverse range of projects, from small business websites to complex web applications for enterprise clients.",
    "My approach to development is centered around the user experience. I believe that great software should not only function flawlessly but also provide an intuitive and enjoyable experience for the end user.",
    "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying outdoor activities to recharge my creative energy."
  ],
  workExperience: [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "Tech Solutions Inc.",
      period: "2020 - Present",
      description: "Leading frontend development for enterprise clients, focusing on React applications with TypeScript."
    },
    {
      id: "2",
      title: "UI/UX Developer",
      company: "Creative Agency",
      period: "2017 - 2020",
      description: "Designed and developed responsive websites and interactive prototypes."
    }
  ],
  education: [
    {
      id: "1",
      degree: "Master of Computer Science",
      institution: "University of Technology",
      period: "2015 - 2017",
      description: "Specialized in Human-Computer Interaction and User Interface Design."
    },
    {
      id: "2",
      degree: "Bachelor of Software Engineering",
      institution: "State University",
      period: "2011 - 2015",
      description: "Foundation in programming, software design, and development methodologies."
    }
  ],
  skillCategories: [
    {
      id: "1",
      title: "Technical Skills",
      skills: ["React", "TypeScript", "Next.js", "HTML/CSS", "JavaScript", "Node.js", "Git", "TailwindCSS"]
    },
    {
      id: "2",
      title: "Design Skills",
      skills: ["UI/UX Design", "Figma", "Responsive Design", "Design Systems", "Wireframing"]
    },
    {
      id: "3",
      title: "Soft Skills",
      skills: ["Communication", "Team Leadership", "Project Management", "Problem Solving"]
    }
  ],
  values: [
    {
      id: "1",
      title: "User-Centered Design",
      description: "I believe in putting the user first in all design and development decisions."
    },
    {
      id: "2",
      title: "Continuous Learning",
      description: "Technology evolves rapidly, and I'm committed to always learning and improving."
    },
    {
      id: "3",
      title: "Attention to Detail",
      description: "The small details often make the biggest difference in user experience."
    },
    {
      id: "4",
      title: "Collaboration",
      description: "Great products are built by great teams working together."
    }
  ]
}; 