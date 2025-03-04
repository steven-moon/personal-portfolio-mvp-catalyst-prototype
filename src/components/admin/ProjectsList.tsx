import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { FilePlus, FileEdit, Trash, FileText, ExternalLink, Image } from 'lucide-react';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import { Project } from '@/components/projects/ProjectCard';

// Import projects data from the Projects page
const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A modern e-commerce platform with seamless checkout experience.",
    image: "/placeholder.svg",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://example.com",
    fullDescription: "This comprehensive e-commerce solution features product browsing, cart management, secure checkout with Stripe integration, and a responsive design. The frontend is built with React and styled with Tailwind CSS, while the backend uses Node.js with Express and MongoDB for data storage. The site includes user authentication, order tracking, and an admin dashboard for product management.",
    images: [
      "/placeholder.svg",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      "https://images.unsplash.com/photo-1518770660439-4636190af475"
    ]
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application for teams.",
    image: "/placeholder.svg",
    tags: ["React", "TypeScript", "Firebase", "TailwindCSS"],
    link: "https://example.com",
    fullDescription: "This task management application helps teams organize and track their projects effectively. Users can create tasks, assign them to team members, set deadlines, and track progress. The app features real-time updates using Firebase, drag-and-drop task organization, and customizable project boards. Built with React and TypeScript, the application implements robust state management and ensures type safety throughout the codebase.",
    images: [
      "/placeholder.svg",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
    ]
  },
  {
    id: 3,
    title: "Finance Dashboard",
    description: "An interactive dashboard for personal finance tracking.",
    image: "/placeholder.svg",
    tags: ["React", "Redux", "Recharts", "Express"],
    link: "https://example.com",
    fullDescription: "This financial dashboard provides users with in-depth insights into their spending habits and financial health. The application visualizes data through interactive charts and graphs using Recharts, allowing users to understand their finances at a glance. Features include expense categorization, budget setting, goal tracking, and financial forecasting. The frontend is built with React and Redux, while the backend is powered by Express with secure authentication.",
    images: [
      "/placeholder.svg",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
    ]
  }
];

const ProjectItem = ({ project, onEdit, onDelete }: { 
  project: Project; 
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const navigate = useNavigate();
  
  return (
    <NeumorphicCard className="mb-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="w-full md:w-2/3">
          <h3 className="text-lg font-semibold mb-1 text-foreground">{project.title}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {project.tags.slice(0, 3).map(tag => (
              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed text-primary">
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed text-muted-foreground">
                +{project.tags.length - 3} more
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
          
          {project.images && project.images.length > 1 && (
            <div className="mt-2 flex items-center text-muted-foreground text-sm">
              <Image size={14} className="mr-1" />
              {project.images.length} images
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-4 md:mt-0 md:w-1/3 gap-2">
          <NeumorphicButton 
            size="sm" 
            variant="secondary"
            onClick={() => window.open(`/project/${project.id}`, '_blank')}
            className="flex items-center gap-1"
          >
            <ExternalLink size={14} />
            View
          </NeumorphicButton>
          
          <NeumorphicButton 
            size="sm" 
            variant="secondary"
            onClick={() => onEdit(project.id)}
            className="flex items-center gap-1"
          >
            <FileEdit size={14} />
            Edit
          </NeumorphicButton>
          
          <NeumorphicButton 
            size="sm" 
            variant="secondary"
            onClick={() => onDelete(project.id)}
            className="flex items-center gap-1"
          >
            <Trash size={14} />
            Delete
          </NeumorphicButton>
        </div>
      </div>
    </NeumorphicCard>
  );
};

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  
  const handleEdit = (id: number) => {
    navigate(`/admin/projects/edit/${id}`);
  };
  
  const handleDelete = (id: number) => {
    // In a real app, this would be an API call to delete the project
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(project => project.id !== id));
      toast.success('Project deleted successfully');
    }
  };
  
  const handleNewProject = () => {
    navigate('/admin/projects/new');
  };
  
  return (
    <div className="container py-8 mx-auto bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage Projects</h1>
        <NeumorphicButton 
          onClick={handleNewProject}
          className="flex items-center gap-2"
        >
          <FilePlus size={18} />
          New Project
        </NeumorphicButton>
      </div>
      
      <div className="bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none pl-10 text-foreground"
              placeholder="Search projects..."
            />
            <span className="absolute left-3 top-3 text-muted-foreground">
              <FileText size={18} />
            </span>
          </div>
          
          <select
            className="p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none w-full md:w-48 text-foreground"
          >
            <option value="">All Tags</option>
            <option value="React">React</option>
            <option value="TypeScript">TypeScript</option>
            <option value="TailwindCSS">TailwindCSS</option>
          </select>
        </div>
      </div>
      
      <div>
        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectItem 
              key={project.id} 
              project={project} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No projects found</p>
            <NeumorphicButton 
              onClick={handleNewProject}
              className="flex items-center gap-2 mx-auto"
            >
              <FilePlus size={18} />
              Create Your First Project
            </NeumorphicButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
