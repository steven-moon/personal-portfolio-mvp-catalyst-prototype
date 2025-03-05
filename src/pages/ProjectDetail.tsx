import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import ImageGallery from '@/components/projects/ImageGallery';
import { Project } from '@/data/projectData';
import { ProjectService } from '@/lib/apiService';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import LocalImage from '@/components/ui/LocalImage';

// Default images to use when none are provided
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&auto=format";
const DEFAULT_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&auto=format",
  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&auto=format",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&auto=format"
];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError('Project ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const projectData = await ProjectService.getProjectById(Number(id));
        setProject(projectData);
        setError(null);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project data. The project may not exist.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-6">
        <div className="text-center py-12">
          <p className="text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !project) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-6">
        <div className="text-center py-12">
          <p className="text-lg text-red-500">{error || 'Project not found'}</p>
          <NeumorphicButton
            onClick={() => navigate('/projects')}
            className="mt-4 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </NeumorphicButton>
        </div>
      </div>
    );
  }

  // Check if we have valid images or need to use defaults
  const hasImages = project.images && project.images.length > 0 && !project.images.every(img => img === "/placeholder.svg");
  const displayImages = hasImages ? project.images : DEFAULT_GALLERY_IMAGES;

  return (
    <div className="max-w-5xl mx-auto py-20 px-6 bg-background animate-fade-in">
      <div className="mb-8">
        <Link to="/projects">
          <NeumorphicButton
            variant="secondary"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </NeumorphicButton>
        </Link>
      </div>

      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4 text-foreground">{project.title}</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-full text-sm font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-background rounded-xl overflow-hidden shadow-neu dark:shadow-dark-neu">
          <ImageGallery images={displayImages} />
        </div>
        
        <div>
          <NeumorphicCard className="h-full p-6">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Project Overview</h2>
              <p className="text-muted-foreground">{project.fullDescription}</p>
              
              {project.link && (
                <div className="mt-6">
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <NeumorphicButton className="flex items-center gap-2">
                      <ExternalLink size={16} />
                      Visit Project
                    </NeumorphicButton>
                  </a>
                </div>
              )}
            </div>
          </NeumorphicCard>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
