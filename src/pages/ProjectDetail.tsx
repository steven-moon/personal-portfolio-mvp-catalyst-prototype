import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import ImageGallery from '@/components/projects/ImageGallery';
import { Project } from '@/components/projects/ProjectCard';

// Default images to use when none are provided
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&auto=format";
const DEFAULT_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&auto=format",
  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&auto=format",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&auto=format"
];

// Import projects data to find the project
const PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A modern e-commerce platform with seamless checkout experience.",
    image: DEFAULT_IMAGE,
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://example.com",
    fullDescription: "This comprehensive e-commerce solution features product browsing, cart management, secure checkout with Stripe integration, and a responsive design. The frontend is built with React and styled with Tailwind CSS, while the backend uses Node.js with Express and MongoDB for data storage. The site includes user authentication, order tracking, and an admin dashboard for product management.",
    images: [
      DEFAULT_IMAGE,
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      "https://images.unsplash.com/photo-1518770660439-4636190af475"
    ]
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application for teams.",
    image: DEFAULT_IMAGE,
    tags: ["React", "TypeScript", "Firebase", "TailwindCSS"],
    link: "https://example.com",
    fullDescription: "This task management application helps teams organize and track their projects effectively. Users can create tasks, assign them to team members, set deadlines, and track progress. The app features real-time updates using Firebase, drag-and-drop task organization, and customizable project boards. Built with React and TypeScript, the application implements robust state management and ensures type safety throughout the codebase.",
    images: [
      DEFAULT_IMAGE,
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
    ]
  },
  {
    id: 3,
    title: "Finance Dashboard",
    description: "An interactive dashboard for personal finance tracking.",
    image: DEFAULT_IMAGE,
    tags: ["React", "Redux", "Recharts", "Express"],
    link: "https://example.com",
    fullDescription: "This financial dashboard provides users with in-depth insights into their spending habits and financial health. The application visualizes data through interactive charts and graphs using Recharts, allowing users to understand their finances at a glance. Features include expense categorization, budget setting, goal tracking, and financial forecasting. The frontend is built with React and Redux, while the backend is powered by Express with secure authentication.",
    images: [
      DEFAULT_IMAGE,
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
    ]
  },
  {
    id: 4,
    title: "Weather Application",
    description: "A beautiful weather app with detailed forecasts and visualizations.",
    image: DEFAULT_IMAGE,
    tags: ["React", "OpenWeather API", "Framer Motion", "TailwindCSS"],
    link: "https://example.com",
    fullDescription: "This weather application provides users with accurate forecasts and beautiful visualizations. The app features current conditions, hourly and weekly forecasts, precipitation maps, and customizable alerts. Using the OpenWeather API for data, the application presents information in an intuitive interface with smooth animations powered by Framer Motion. The responsive design ensures a great experience across devices, from desktop to mobile.",
    images: [DEFAULT_IMAGE, "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b"]
  },
  {
    id: 5,
    title: "Social Media Dashboard",
    description: "An all-in-one dashboard for managing social media accounts.",
    image: DEFAULT_IMAGE,
    tags: ["React", "Next.js", "Social APIs", "ChartJS"],
    link: "https://example.com",
    fullDescription: "This social media dashboard allows users to manage multiple social accounts from a single interface. The application integrates with various social media platforms, allowing users to schedule posts, monitor engagement, and analyze performance metrics. Features include content calendars, analytics with ChartJS visualizations, audience insights, and competitor analysis. Built with Next.js for optimal performance and SEO, the dashboard implements server-side rendering for faster page loads.",
    images: [DEFAULT_IMAGE, "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7"]
  },
  {
    id: 6,
    title: "Portfolio Website",
    description: "A modern portfolio site for showcasing creative work.",
    image: DEFAULT_IMAGE,
    tags: ["React", "Framer Motion", "TailwindCSS", "TypeScript"],
    link: "https://example.com",
    fullDescription: "This portfolio website showcases creative work with a focus on visual impact and smooth user experience. The site features project galleries with filterable categories, detailed case studies, and interactive elements that engage visitors. Built with React and TypeScript, the portfolio implements elegant animations with Framer Motion and responsive layouts with TailwindCSS. The design emphasizes content presentation while maintaining fast load times and accessibility.",
    images: [DEFAULT_IMAGE, "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8"]
  }
];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = PROJECTS.find(p => p.id === Number(id));
  
  if (!project) {
    return (
      <div className="container py-20 px-6 mx-auto text-center bg-background">
        <h1 className="text-3xl font-bold mb-4 text-foreground">Project Not Found</h1>
        <p className="mb-8 text-muted-foreground">The project you're looking for doesn't exist or has been removed.</p>
        <Link to="/projects">
          <NeumorphicButton>
            Return to Projects
          </NeumorphicButton>
        </Link>
      </div>
    );
  }

  // Ensure project has valid images
  const projectImages = project.images && project.images.length > 0 
    ? project.images.every(img => img === "/placeholder.svg") 
      ? DEFAULT_GALLERY_IMAGES 
      : project.images
    : [project.image || DEFAULT_IMAGE];

  return (
    <main className="page-transition py-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <Link to="/projects" className="inline-flex items-center mb-8 text-primary hover:underline">
          <ArrowLeft className="mr-2" size={18} />
          Back to all projects
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{project.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span key={tag} className="py-1 px-3 neu-flat dark:shadow-dark-neu-flat rounded-full text-sm text-foreground bg-background">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <ImageGallery images={projectImages} />
        
        <div className="neu-flat dark:shadow-dark-neu-flat p-6 rounded-xl my-8 bg-background">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Project Overview</h2>
          <div className="text-muted-foreground space-y-4">
            <p>{project.fullDescription}</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            <NeumorphicButton className="flex items-center gap-2">
              Visit Project
              <ExternalLink size={16} />
            </NeumorphicButton>
          </a>
        </div>
      </div>
    </main>
  );
};

export default ProjectDetail;
