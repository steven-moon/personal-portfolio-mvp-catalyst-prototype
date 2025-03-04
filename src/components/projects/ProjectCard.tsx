import React from 'react';
import { Link } from 'react-router-dom';
import NeumorphicCard from '../ui/NeumorphicCard';
import NeumorphicButton from '../ui/NeumorphicButton';

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
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <NeumorphicCard 
      className="h-full flex flex-col transition-medium hover:scale-[1.02]"
    >
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 mb-4 rounded-lg overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{project.title}</h3>
      <p className="text-muted-foreground mb-4 flex-grow">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span key={tag} className="py-1 px-2 neu-pressed dark:shadow-dark-neu-pressed rounded-md text-xs text-foreground bg-background">
            {tag}
          </span>
        ))}
      </div>
      <Link to={`/project/${project.id}`}>
        <NeumorphicButton
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
        >
          View Details
        </NeumorphicButton>
      </Link>
    </NeumorphicCard>
  );
};

export default ProjectCard;
