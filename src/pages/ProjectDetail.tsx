import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowLeft, X, Image } from 'lucide-react';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import ImageGallery from '@/components/projects/ImageGallery';
import { Project, Tag } from '@/data/projectData';
import { ProjectService } from '@/lib/apiService';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import LocalImage from '@/components/ui/LocalImage';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';

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

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  // Handle opening the gallery modal
  const openGalleryModal = (index: number = 0) => {
    setSelectedImageIndex(index);
    setIsGalleryModalOpen(true);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="text-center py-12">
          <p className="text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !project) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-6">
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
  const hasImages = project.images && project.images.length > 0;
  const displayImages = hasImages 
    ? project.images.map((img: any) => typeof img === 'string' ? img : img.imageUrl) 
    : DEFAULT_GALLERY_IMAGES;

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 bg-background animate-fade-in">
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
              key={typeof tag === 'string' ? `tag-${index}` : tag.id}
              className="px-3 py-1 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-full text-sm font-medium text-primary"
            >
              {getTagName(tag)}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-background rounded-xl overflow-hidden shadow-neu dark:shadow-dark-neu">
          <div className="pt-3 px-3 text-center">
            <p className="text-sm text-muted-foreground">Click on an image to view in full screen</p>
          </div>
          <ImageGallery 
            images={displayImages} 
            onImageClick={(index) => openGalleryModal(index)}
          />
          <div className="p-4 text-center">
            <NeumorphicButton
              onClick={() => openGalleryModal(0)}
              className="inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200"
              variant="secondary"
            >
              <Image size={16} />
              <span>View Gallery</span>
            </NeumorphicButton>
          </div>
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

      {/* Image Gallery Modal */}
      <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
        <DialogContent className="max-w-7xl w-[95vw] p-0 bg-background/95 backdrop-blur-sm">
          <button 
            onClick={() => setIsGalleryModalOpen(false)}
            className="absolute right-4 top-4 z-50 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>
          
          <FullScreenImageGallery 
            images={displayImages} 
            initialIndex={selectedImageIndex} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Full screen image gallery component for the modal
const FullScreenImageGallery: React.FC<{ images: string[], initialIndex: number }> = ({ images, initialIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  // Reset loading state when image changes
  useEffect(() => {
    setIsImageLoading(true);
  }, [currentIndex]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };
  
  const handlePrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          // The Dialog component handles ESC for closing
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <div className="flex flex-col h-[90vh] py-8 px-4">
      <div className="relative flex-1 h-full w-full">
        <div className="h-full w-full flex items-center justify-center">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <LocalImage 
            src={images[currentIndex]} 
            alt={`Project image ${currentIndex + 1}`}
            className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
            fallbackSrc="/placeholder.svg"
            onLoad={handleImageLoad}
          />
        </div>
        
        <button 
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
          aria-label="Previous image"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
          aria-label="Next image"
        >
          <ArrowLeft size={24} className="rotate-180" />
        </button>
      </div>
      
      {images.length > 1 && (
        <div className="pt-6 mt-auto">
          <div className="flex justify-center gap-2 overflow-x-auto py-2 px-1">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all ${
                  index === currentIndex ? 'ring-2 ring-primary scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <LocalImage 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  fallbackSrc="/placeholder.svg"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-center text-sm text-muted-foreground mt-2">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ProjectDetail;
