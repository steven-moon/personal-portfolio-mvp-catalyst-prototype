
import React from 'react';
import ProjectCard, { Project } from '@/components/projects/ProjectCard';

const Projects = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "A modern e-commerce platform with seamless checkout experience.",
      image: "/placeholder.svg",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "https://example.com",
      fullDescription: "This comprehensive e-commerce solution features product browsing, cart management, secure checkout with Stripe integration, and a responsive design. The frontend is built with React and styled with Tailwind CSS, while the backend uses Node.js with Express and MongoDB for data storage. The site includes user authentication, order tracking, and an admin dashboard for product management."
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application for teams.",
      image: "/placeholder.svg",
      tags: ["React", "TypeScript", "Firebase", "TailwindCSS"],
      link: "https://example.com",
      fullDescription: "This task management application helps teams organize and track their projects effectively. Users can create tasks, assign them to team members, set deadlines, and track progress. The app features real-time updates using Firebase, drag-and-drop task organization, and customizable project boards. Built with React and TypeScript, the application implements robust state management and ensures type safety throughout the codebase."
    },
    {
      id: 3,
      title: "Finance Dashboard",
      description: "An interactive dashboard for personal finance tracking.",
      image: "/placeholder.svg",
      tags: ["React", "Redux", "Recharts", "Express"],
      link: "https://example.com",
      fullDescription: "This financial dashboard provides users with in-depth insights into their spending habits and financial health. The application visualizes data through interactive charts and graphs using Recharts, allowing users to understand their finances at a glance. Features include expense categorization, budget setting, goal tracking, and financial forecasting. The frontend is built with React and Redux, while the backend is powered by Express with secure authentication."
    },
    {
      id: 4,
      title: "Weather Application",
      description: "A beautiful weather app with detailed forecasts and visualizations.",
      image: "/placeholder.svg",
      tags: ["React", "OpenWeather API", "Framer Motion", "TailwindCSS"],
      link: "https://example.com",
      fullDescription: "This weather application provides users with accurate forecasts and beautiful visualizations. The app features current conditions, hourly and weekly forecasts, precipitation maps, and customizable alerts. Using the OpenWeather API for data, the application presents information in an intuitive interface with smooth animations powered by Framer Motion. The responsive design ensures a great experience across devices, from desktop to mobile."
    },
    {
      id: 5,
      title: "Social Media Dashboard",
      description: "An all-in-one dashboard for managing social media accounts.",
      image: "/placeholder.svg",
      tags: ["React", "Next.js", "Social APIs", "ChartJS"],
      link: "https://example.com",
      fullDescription: "This social media dashboard allows users to manage multiple social accounts from a single interface. The application integrates with various social media platforms, allowing users to schedule posts, monitor engagement, and analyze performance metrics. Features include content calendars, analytics with ChartJS visualizations, audience insights, and competitor analysis. Built with Next.js for optimal performance and SEO, the dashboard implements server-side rendering for faster page loads."
    },
    {
      id: 6,
      title: "Portfolio Website",
      description: "A modern portfolio site for showcasing creative work.",
      image: "/placeholder.svg",
      tags: ["React", "Framer Motion", "TailwindCSS", "TypeScript"],
      link: "https://example.com",
      fullDescription: "This portfolio website showcases creative work with a focus on visual impact and smooth user experience. The site features project galleries with filterable categories, detailed case studies, and interactive elements that engage visitors. Built with React and TypeScript, the portfolio implements elegant animations with Framer Motion and responsive layouts with TailwindCSS. The design emphasizes content presentation while maintaining fast load times and accessibility."
    }
  ];

  return (
    <main className="page-transition py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl font-bold mb-4">My Projects</h1>
          <p className="text-xl text-neu-text-secondary max-w-2xl mx-auto">
            Here's a selection of my recent work. Each project represents a unique challenge and solution.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Projects;
