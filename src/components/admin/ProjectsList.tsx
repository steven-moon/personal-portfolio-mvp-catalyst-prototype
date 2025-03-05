import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { FilePlus, FileEdit, Trash, FileText, ExternalLink, Image } from 'lucide-react';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import { ProjectService } from '@/lib/apiService';
import { Project, Tag } from '@/data/projectData';
import LocalImage from '@/components/ui/LocalImage';

// Default images to use when none are provided
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&auto=format";
const DEFAULT_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&auto=format",
  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&auto=format",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&auto=format"
];

// Helper function to get tag name regardless of tag format (string or object)
const getTagName = (tag: string | Tag): string => {
  if (typeof tag === 'string') {
    return tag;
  }
  return tag.name;
};

const ProjectItem = ({ project, onEdit, onDelete }: { 
  project: Project; 
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const navigate = useNavigate();
  
  // Get the first image or a default
  const mainImage = project.images && project.images.length > 0 
    ? project.images[0] 
    : project.image || DEFAULT_IMAGE;
  
  return (
    <NeumorphicCard className="mb-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center">
        <div 
          className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden mr-4 mb-4 md:mb-0 cursor-pointer"
          onClick={() => onEdit(project.id)}
        >
          <LocalImage 
            src={mainImage} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            fallbackSrc={DEFAULT_IMAGE}
          />
        </div>
        
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-1 text-foreground">{project.title}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {project.tags.map((tag, index) => (
              <span 
                key={typeof tag === 'string' ? `tag-${index}` : tag.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed text-primary"
              >
                {getTagName(tag)}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
        </div>
        
        <div className="flex mt-4 md:mt-0 gap-2 justify-end">
          <NeumorphicButton 
            size="sm" 
            variant="secondary"
            onClick={() => navigate(`/project/${project.id}`)}
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch projects when component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await ProjectService.getAllProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const handleEdit = (id: number) => {
    navigate(`/admin/projects/edit/${id}`);
  };
  
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await ProjectService.deleteProject(id);
        setProjects(projects.filter(project => project.id !== id));
        toast.success('Project deleted successfully');
      } catch (err) {
        console.error('Error deleting project:', err);
        toast.error('Failed to delete project. Please try again.');
      }
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
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-lg">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ProjectsList;
