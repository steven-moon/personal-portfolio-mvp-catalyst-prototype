import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "sonner";
import { Save, X, Plus, Trash, FileImage, ArrowLeft, Upload } from 'lucide-react';
import { Project, Tag, ProjectImage, ProjectFormData } from '@/types/project';
import { ProjectService } from '@/lib/apiService';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import LocalImage from '@/components/ui/LocalImage';
import ImageUploader from '@/components/ui/ImageUploader';
import { DEFAULT_IMAGE } from '@/lib/constants';
import ImageCard from '@/components/ui/ImageCard';

// Constants
const defaultProject: ProjectEditorState = {
  id: 0,
  title: '',
  description: '',
  fullDescription: '',
  image: DEFAULT_IMAGE,
  images: [DEFAULT_IMAGE],
  tags: [],
  featured: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  link: '',
  githubLink: ''
};

const getTagName = (tag: string | Tag): string => {
  if (typeof tag === 'string') {
    return tag;
  }
  return tag.name;
};

const isSameTag = (tag1: string | Tag, tag2: string | Tag): boolean => {
  const name1 = getTagName(tag1);
  const name2 = getTagName(tag2);
  return name1.toLowerCase() === name2.toLowerCase();
};

const ProjectEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  // Define project state using the Project type
  const [project, setProject] = useState<Project>({
    id: 0,
    title: '',
    description: '',
    fullDescription: '',
    image: DEFAULT_IMAGE,
    images: [DEFAULT_IMAGE],
    tags: []
  });
  
  // Separate editor state for UI-specific properties
  const [editorState, setEditorState] = useState({
    projectImages: [] as { imageUrl: string; isMain: boolean; order: number }[],
    newTag: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch project data if in edit mode
  useEffect(() => {
    setIsLoading(true);
    
    const fetchProject = async () => {
      try {
        // Check if we're in edit mode with a valid ID
        if (isEditMode && id) {
          console.log('🔍 DEBUG - fetchProject - Fetching project with ID:', id);
          
          const fetchedProject = await ProjectService.getProjectById(parseInt(id, 10));
          console.log('🔍 DEBUG - fetchProject - Fetched project:', fetchedProject);
          
          if (fetchedProject) {
            setProject(fetchedProject);
          } else {
            console.warn('🔍 DEBUG - fetchProject - Project not found, redirecting to admin');
            toast.error('Project not found');
            navigate('/admin');
          }
        } else {
          // Create a new project with default values
          console.log('🔍 DEBUG - fetchProject - Creating new project template');
          
          // Use type assertion to cast to Project type
          const newProject = {
            id: 0,
            title: '',
            description: '',
            fullDescription: '',
            image: DEFAULT_IMAGE,
            images: [DEFAULT_IMAGE],
            tags: []
          } as Project;
          
          setProject(newProject);
        }
      } catch (error) {
        console.error('🔍 DEBUG - fetchProject - Error fetching project:', error);
        toast.error('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [id, isEditMode, navigate]);

  const handleSave = async () => {
    console.log('🔍 DEBUG - handleSave called, current project state:', project);
    
    if (!project.title.trim()) {
      toast.error("Project title is required");
      return;
    }

    if (!project.description.trim()) {
      toast.error("Project description is required");
      return;
    }

    if (!project.images || project.images.length === 0) {
      toast.error("At least one project image is required");
      return;
    }

    console.log('🔍 DEBUG - Project images before processing:', project.images);
    
    // Normalize image paths - ensure they're in a consistent format
    const normalizedImages = project.images.map(img => {
      // Convert ProjectImage objects to string paths
      let imagePath = typeof img === 'string' ? img : img.imageUrl;
      
      // Remove any query parameters (like timestamps)
      imagePath = imagePath.split('?')[0];
      
      // If it's an assets path, normalize it to images path
      if (imagePath.startsWith('/assets/images/')) {
        const filename = imagePath.split('/').pop();
        if (filename) {
          imagePath = `/images/${filename}`;
        }
      }
      
      console.log('🔍 DEBUG - Normalized image path:', imagePath);
      
      // Verify image exists in localStorage
      try {
        const directKey = `portfolio_images_${imagePath}`;
        const hasImage = localStorage.getItem(directKey);
        console.log('🔍 DEBUG - Checking image in localStorage:', directKey, 'exists:', !!hasImage);
      } catch (e) {
        console.warn('🔍 DEBUG - Error checking localStorage for image:', e);
      }
      
      return imagePath;
    });
    
    const updatedProject = {
      ...project,
      images: normalizedImages,
      image: normalizedImages[0], // Main image is always the first one
      tags: project.tags.map(tag => typeof tag === 'string' ? tag : tag.name)
    };
    
    console.log('🔍 DEBUG - Processed project data for saving:', updatedProject);
    console.log('🔍 DEBUG - Tags being sent to API:', updatedProject.tags);
    console.log('🔍 DEBUG - Images being sent to API:', updatedProject.images);

    try {
      setIsLoading(true);
      if (isEditMode) {
        console.log('🔍 DEBUG - Updating existing project with ID:', id);
        // Make sure tags and images are explicitly included in the update
        const updateData = {
          title: updatedProject.title,
          description: updatedProject.description,
          fullDescription: updatedProject.fullDescription,
          image: updatedProject.image,
          images: updatedProject.images,
          tags: updatedProject.tags,
          link: updatedProject.link,
          githubLink: updatedProject.githubLink,
          featured: updatedProject.featured
        };
        
        // Also sync the images with the backend (this will update ProjectImages table)
        await syncProjectImages(Number(id), updatedProject.images);
        
        const response = await ProjectService.updateProject(Number(id), updateData);
        console.log('🔍 DEBUG - Update response:', response);
        
        // Clear any cached state to ensure fresh data on next load
        localStorage.removeItem('project_editor_state');
        
        toast.success("Project updated successfully");
      } else {
        console.log('🔍 DEBUG - Creating new project');
        const newProject = await ProjectService.createProject(updatedProject);
        
        // Clear any cached state to ensure fresh data on next load
        localStorage.removeItem('project_editor_state');
        
        toast.success("Project created successfully");
      }
      
      navigate('/admin/projects');
    } catch (error) {
      console.error('🔍 DEBUG - Error saving project:', error);
      toast.error("Failed to save project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/projects');
  };

  const handleAddTag = () => {
    if (!editorState.newTag.trim()) return;
    
    // Check if tag already exists
    const tagExists = project.tags.some(tag => isSameTag(tag, editorState.newTag));
    if (tagExists) {
      toast.error("Tag already exists");
      return;
    }
    
    setProject({
      ...project,
      tags: [...project.tags, editorState.newTag]
    });
    setEditorState({ ...editorState, newTag: '' });
  };

  const handleRemoveTag = (tagToRemove: string | Tag) => {
    setProject({
      ...project,
      tags: project.tags.filter(tag => !isSameTag(tag, tagToRemove))
    });
  };

  const handleRemoveImage = (index: number) => {
    console.log('🔍 DEBUG - Removing image at index:', index);
    
    // Check if we need to prevent removing the last image
    if (project.images.length <= 1) {
      toast.error("You must have at least one project image");
      return;
    }
    
    const imageToRemove = project.images[index];
    console.log('🔍 DEBUG - Image to remove:', imageToRemove);
    
    const newImages = [...project.images];
    newImages.splice(index, 1);
    
    setProject({
      ...project,
      images: newImages,
      // If removing the main image, set the new first image as main
      image: index === 0 ? (typeof newImages[0] === 'string' ? newImages[0] : newImages[0].imageUrl) : project.image
    });
    
    // If we're in edit mode and have an actual ProjectImage with ID, we'll delete it from the database in the save function
    // This approach allows us to batch all image changes together when saving
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return; // Already the main image
    
    const newImages = [...project.images];
    const temp = newImages[0];
    newImages[0] = newImages[index];
    newImages[index] = temp;
    
    setProject({
      ...project,
      images: newImages
    });
  };

  const handleImageUploaded = (originalUrl: string) => {
    console.log('📸 DEBUG - ProjectEditor - Image uploaded, original URL:', originalUrl);
    
    // Clean URL to remove query parameters
    const cleanedUrl = originalUrl.split('?')[0];
    console.log('📸 DEBUG - ProjectEditor - Cleaned image URL:', cleanedUrl);
    
    // Always add a timestamp to ensure uniqueness
    const imageUrl = `${cleanedUrl}?t=${Date.now()}`;
    console.log('📸 DEBUG - ProjectEditor - Adding with timestamp to ensure uniqueness:', imageUrl);
    
    // Verify the image exists in localStorage
    const { exists, dataUrl } = verifyImageInLocalStorage(cleanedUrl);
    
    if (!exists) {
      console.warn('📸 DEBUG - ProjectEditor - Image not found in localStorage!');
      toast.error('Image upload failed: Not found in local storage');
      return;
    }
    
    // If we found image data under a different key, ensure it's stored with the direct key
    if (dataUrl) {
      try {
        // Store under both the clean and timestamped keys
        localStorage.setItem(`portfolio_images_${cleanedUrl}`, dataUrl);
        localStorage.setItem(`portfolio_images_${imageUrl}`, dataUrl);
        console.log('📸 DEBUG - ProjectEditor - Stored image data under direct keys for future use');
      } catch (e) {
        console.warn('📸 DEBUG - ProjectEditor - Error storing image data:', e);
      }
    }
    
    // Create a new copy of the images array to avoid reference issues
    const updatedImages = [...project.images, imageUrl];
    console.log('📸 DEBUG - ProjectEditor - Updated images array:', updatedImages);
    
    // Update project with new images
    setProject({
      ...project,
      images: updatedImages,
      // If this is the first image, set it as the main image
      image: project.image || imageUrl
    });
    
    toast.success('Image added successfully');
    console.log('📸 DEBUG - ProjectEditor - Project state after image addition:', project);
  };

  // Utility function to verify an image exists in localStorage
  const verifyImageInLocalStorage = (imageUrl: string): { exists: boolean, dataUrl?: string } => {
    console.log('🔍 DEBUG - ProjectEditor - Verifying image in localStorage:', imageUrl);
    
    if (!imageUrl) return { exists: false };
    
    // Extract filename for key variations
    const filename = imageUrl.split('/').pop();
    if (!filename) return { exists: false };
    
    // Try all possible key formats
    const keyFormats = [
      `portfolio_images_${imageUrl}`,
      `portfolio_image_${filename}`,
      `portfolio_images_/images/${filename}`
    ];
    
    for (const key of keyFormats) {
      try {
        const data = localStorage.getItem(key);
        if (data && data.startsWith('data:')) {
          console.log('🔍 DEBUG - ProjectEditor - Found image with key:', key);
          return { exists: true, dataUrl: data };
        }
      } catch (e) {
        console.warn('🔍 DEBUG - ProjectEditor - Error checking key:', key, e);
      }
    }
    
    // Last resort: search all keys
    try {
      const allKeys = Object.keys(localStorage);
      const filenameNoExt = filename.includes('.') 
        ? filename.substring(0, filename.lastIndexOf('.')) 
        : filename;
      
      for (const key of allKeys) {
        if ((key.includes(filename) || key.includes(filenameNoExt)) && 
            key.includes('portfolio_')) {
          const data = localStorage.getItem(key);
          if (data && data.startsWith('data:')) {
            console.log('🔍 DEBUG - ProjectEditor - Found image by searching keys:', key);
            return { exists: true, dataUrl: data };
          }
        }
      }
    } catch (e) {
      console.warn('🔍 DEBUG - ProjectEditor - Error searching localStorage keys:', e);
    }
    
    return { exists: false };
  };

  const renderImagesSection = () => {
    // Create a unique set of images based on URLs to avoid duplicates while preserving order
    // This ensures each image appears exactly once in the grid
    const uniqueImages = Array.from(new Set(project.images.map(img => 
      typeof img === 'string' ? img : img.imageUrl
    )));
    
    console.log('🖼️ DEBUG - ProjectEditor - Unique images for rendering:', uniqueImages);
    
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Project Images</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Map through unique images to render each one */}
          {uniqueImages.map((imageUrl, index) => (
            <div key={`${imageUrl}-${index}`} className="relative">
              <ImageCard
                imageUrl={imageUrl}
                isMain={imageUrl === project.image}
                index={index}
                onSetAsMain={handleSetMainImage}
                onRemove={handleRemoveImage}
                canRemove={uniqueImages.length > 1}
              />
            </div>
          ))}
          
          {/* Image uploader */}
          <div className="aspect-square">
            <ImageUploader 
              onImageUploaded={handleImageUploaded}
              aspect={1}
              title="Add Project Image"
              description="Upload a square image for your project"
              storageKey="IMAGES"
              entityId={Number(project.id) || undefined}
            />
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          Recommended size: 800×800 pixels. Images will be displayed in a square aspect ratio.
        </p>
      </section>
    );
  };

  // New function to sync project images with backend
  const syncProjectImages = async (projectId: number, images: (string | ProjectImage)[]) => {
    console.log('🔍 DEBUG - Syncing project images with backend');
    
    try {
      // First, get current images from the backend
      const projectData = await ProjectService.getProjectById(projectId);
      const currentImages = projectData.images || [];
      console.log('🔍 DEBUG - Current images in backend:', currentImages);
      
      // Identify images to delete (in backend but not in updated project)
      const updatedImageUrls = images.map(img => typeof img === 'string' ? img : img.imageUrl);
      
      // Filter backend images that are not in the updated project
      const imagesToDelete = currentImages.filter(backendImg => {
        if (!backendImg || typeof backendImg !== 'object' || !backendImg.imageUrl) {
          return false;
        }
        return !updatedImageUrls.includes(backendImg.imageUrl);
      });
      
      console.log('🔍 DEBUG - Images to delete:', imagesToDelete);
      
      // Delete images that are no longer in the project
      for (const imageToDelete of imagesToDelete) {
        if (imageToDelete && typeof imageToDelete === 'object' && imageToDelete.id) {
          console.log('🔍 DEBUG - Deleting image:', imageToDelete.id);
          try {
            await fetch(`/api/projects/images/${imageToDelete.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              }
            });
          } catch (error) {
            console.error('🔍 DEBUG - Error deleting image:', error);
          }
        }
      }
      
      // Add new images that are not in the backend yet
      const currentImageUrls = currentImages
        .filter(img => img && typeof img === 'object' && img.imageUrl)
        .map(img => (img as ProjectImage).imageUrl);
      
      const newImages = updatedImageUrls.filter(url => !currentImageUrls.includes(url));
      
      console.log('🔍 DEBUG - New images to add:', newImages);
      
      for (const newImageUrl of newImages) {
        console.log('🔍 DEBUG - Adding new image:', newImageUrl);
        try {
          await fetch(`/api/projects/${projectId}/images`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({ imageUrl: newImageUrl })
          });
        } catch (error) {
          console.error('🔍 DEBUG - Error adding image:', error);
        }
      }
      
      console.log('🔍 DEBUG - Project images synced successfully');
      
    } catch (error) {
      console.error('🔍 DEBUG - Error syncing project images:', error);
    }
  };

  return (
    <div className="container py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <NeumorphicButton
            variant="secondary"
            onClick={() => navigate('/admin/projects')}
            className="mr-4 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </NeumorphicButton>
          <h1 className="text-2xl font-bold text-primary">
            {isEditMode ? 'Edit' : 'Create'} Project
          </h1>
        </div>
        
        {/* Save button at the top */}
        <NeumorphicButton
          onClick={handleSave}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Save size={16} />
          {isLoading ? 'Saving...' : 'Save Project'}
        </NeumorphicButton>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-lg">Loading project data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      ) : (
        <NeumorphicCard className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter project title"
                className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-foreground mb-2 font-medium">Short Description</label>
              <input
                type="text"
                placeholder="Brief description"
                className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-foreground mb-2 font-medium">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tags.map((tag, index) => (
                  <div key={index} className="bg-primary/10 rounded-full px-3 py-1 flex items-center gap-1">
                    <span className="text-sm">{getTagName(tag)}</span>
                    <button 
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add a tag"
                  className="flex-1 p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-l-lg focus:outline-none"
                  value={editorState.newTag}
                  onChange={(e) => setEditorState({ ...editorState, newTag: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-primary text-white px-4 rounded-r-lg hover:bg-primary/90"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2 font-medium">Full Description</label>
              <textarea
                className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none min-h-[200px]"
                placeholder="Detailed description of your project"
                value={project.fullDescription}
                onChange={(e) => setProject({ ...project, fullDescription: e.target.value })}
                required
              />
            </div>

            {renderImagesSection()}
            
            <div className="flex justify-end mt-8 space-x-4">
              <NeumorphicButton
                variant="secondary"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </NeumorphicButton>
              <NeumorphicButton
                onClick={handleSave}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Save size={16} />
                {isLoading ? 'Saving...' : 'Save Project'}
              </NeumorphicButton>
            </div>
          </div>
        </NeumorphicCard>
      )}
    </div>
  );
};

export default ProjectEditor;