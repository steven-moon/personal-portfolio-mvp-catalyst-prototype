
import React, { useState } from 'react';
import NeumorphicCard from '../ui/NeumorphicCard';
import NeumorphicButton from '../ui/NeumorphicButton';
import { ExternalLink, X } from 'lucide-react';

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  fullDescription: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <NeumorphicCard 
        className="h-full flex flex-col transition-medium hover:scale-[1.02]"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="h-48 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">Project Image</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-neu-text-secondary mb-4 flex-grow">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="py-1 px-2 neu-pressed rounded-md text-xs">
              {tag}
            </span>
          ))}
        </div>
        <NeumorphicButton
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          View Details
        </NeumorphicButton>
      </NeumorphicCard>

      {/* Project Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div 
            className="w-full max-w-3xl bg-neu-bg rounded-2xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{project.title}</h2>
              <button 
                className="p-2 neu-flat rounded-full"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="h-64 w-full bg-gray-200 mb-6 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">Project Image</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span key={tag} className="py-1 px-3 neu-flat rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="mb-6 space-y-4 text-neu-text-secondary">
              <p>{project.fullDescription}</p>
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
        </div>
      )}
    </>
  );
};

export default ProjectCard;
