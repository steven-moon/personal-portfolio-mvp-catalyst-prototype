import React from 'react';
import { Link } from 'react-router-dom';
import NeumorphicCard from '../ui/NeumorphicCard';
import NeumorphicButton from '../ui/NeumorphicButton';
import LocalImage from '../ui/LocalImage';

// Default images to use when none are provided
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&auto=format";
const DEFAULT_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&auto=format",
  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&auto=format",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&auto=format"
];

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  fullDescription: string;
  images?: string[]; // Added images array for gallery
}

interface ProjectCardProps {
  project: Project;
  isAdmin?: boolean;
}

const ProjectCard = ({ project, isAdmin = false }: ProjectCardProps) => {
  // Use default image if project.image is empty or "/placeholder.svg"
  const displayImage = (!project.image || project.image === "/placeholder.svg") ? DEFAULT_IMAGE : project.image;
  
  // Define navigation paths based on isAdmin flag
  const linkPath = isAdmin ? `/admin/projects/edit/${project.id}` : `/project/${project.id}`;
  const viewLinkPath = `/project/${project.id}`;
  
  return (
    <NeumorphicCard 
      className="h-full flex flex-col transition-medium hover:scale-[1.02]"
    >
      <Link to={viewLinkPath} className="h-48 w-full bg-gray-200 dark:bg-gray-700 mb-4 rounded-lg overflow-hidden">
        <LocalImage 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          fallbackSrc={DEFAULT_IMAGE}
        />
      </Link>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{project.title}</h3>
      <p className="text-muted-foreground mb-4 flex-grow">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span key={tag} className="py-1 px-2 neu-pressed dark:shadow-dark-neu-pressed rounded-md text-xs text-foreground bg-background">
            {tag}
          </span>
        ))}
      </div>
      <Link to={linkPath}>
        <NeumorphicButton
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
        >
          {isAdmin ? "Edit Project" : "View Details"}
        </NeumorphicButton>
      </Link>
    </NeumorphicCard>
  );
};

export default ProjectCard;
