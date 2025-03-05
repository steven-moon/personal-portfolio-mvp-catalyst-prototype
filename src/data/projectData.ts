// Tag interface matching backend response
export interface Tag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// ProjectImage interface matching backend response
export interface ProjectImage {
  id: number;
  imageUrl: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: Tag[] | string[]; // Can be either Tag objects from backend or string tags in mock data
  link: string;
  fullDescription: string;
  images?: ProjectImage[] | string[]; // Can be either ProjectImage objects from backend or string URLs in mock data
}

// Projects data
export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "A modern personal portfolio with a neumorphic design",
    image: "/images/projects/portfolio.jpg",
    tags: ["React", "TypeScript", "TailwindCSS"],
    link: "https://example.com/portfolio",
    fullDescription: "A personal portfolio website built with React, TypeScript, and TailwindCSS. Features a custom neumorphic design system and responsive layout.",
    images: [
      "/images/projects/portfolio-1.jpg",
      "/images/projects/portfolio-2.jpg",
      "/images/projects/portfolio-3.jpg"
    ]
  },
  {
    id: 2,
    title: "E-commerce Dashboard",
    description: "Admin dashboard for managing an online store",
    image: "/images/projects/ecommerce.jpg",
    tags: ["React", "Redux", "Material UI"],
    link: "https://example.com/ecommerce",
    fullDescription: "A comprehensive admin dashboard for e-commerce stores. Includes inventory management, order processing, and customer analytics features."
  },
  {
    id: 3,
    title: "Weather App",
    description: "Real-time weather forecasting application",
    image: "/images/projects/weather.jpg",
    tags: ["JavaScript", "API Integration", "CSS"],
    link: "https://example.com/weather",
    fullDescription: "A weather application that provides real-time forecasts using weather API integration. Features include location detection, 5-day forecasts, and weather alerts."
  }
]; 