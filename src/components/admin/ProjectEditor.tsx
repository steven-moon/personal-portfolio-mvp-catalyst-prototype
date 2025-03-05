import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "sonner";
import { Save, X, Plus, Trash, ImagePlus, FileImage, ArrowLeft, Upload, Check, Crop as CropIcon } from 'lucide-react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Project, Tag } from '@/data/projectData';
import { ProjectService } from '@/lib/apiService';
import LocalImage from '@/components/ui/LocalImage';
import { storeImageLocally, STORAGE_KEYS } from '@/lib/localStorageUtils';

// Default image to use when none is provided
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&auto=format";

// Image Uploader Component
const ImageUploader = ({ 
  onImageUploaded 
}: { 
  onImageUploaded: (url: string) => void 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    width: 300,
    height: 200,
    x: 0,
    y: 0
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file input change
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    setImageFile(file);
    const localPreviewUrl = URL.createObjectURL(file);
    setImageSrc(localPreviewUrl);
    setIsDialogOpen(true);
  }, []);

  // Trigger file input click
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error("Please drop an image file");
      return;
    }
    
    setImageFile(file);
    const localPreviewUrl = URL.createObjectURL(file);
    setImageSrc(localPreviewUrl);
    setIsDialogOpen(true);
  }, []);

  // Handle image crop
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Calculate the maximum size that fits within the image dimensions while maintaining aspect ratio
    let cropWidth, cropHeight;
    
    // Try using width as the limiting factor
    cropWidth = Math.min(width, 600);
    cropHeight = cropWidth * (2/3); // 3:2 aspect ratio for project images
    
    // If height exceeds image height, recalculate based on height
    if (cropHeight > height) {
      cropHeight = height;
      cropWidth = cropHeight * (3/2);
    }
    
    // Center the crop area
    const x = (width - cropWidth) / 2;
    const y = (height - cropHeight) / 2;
    
    const initialCrop: Crop = {
      unit: 'px',
      width: cropWidth,
      height: cropHeight,
      x: x,
      y: y
    };
    
    // Set both crop and completedCrop to enable the Save button immediately
    setCrop(initialCrop);
    
    // Also set completedCrop so the Save button is enabled immediately
    setCompletedCrop({
      width: cropWidth,
      height: cropHeight,
      x: x,
      y: y,
      unit: 'px'
    });
  }, []);

  // Save the cropped image
  const saveCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !imageFile) return;
    
    try {
      setIsLoading(true);
      
      // Create a canvas with the cropped image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Set the canvas size to the cropped image size
      const pixelRatio = window.devicePixelRatio || 1;
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      
      // Use the pixel ratio and natural image dimensions for better quality
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
      
      // Draw the cropped image to the canvas
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );
      
      // Convert the canvas to a blob with better quality
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.95 // Higher quality for the crop
        );
      });
      
      // Create a File from the Blob
      const croppedFile = new File(
        [blob], 
        `cropped-${imageFile.name}`, 
        { type: 'image/jpeg' }
      );
      
      // Store the image locally
      const localPath = await storeImageLocally(croppedFile, STORAGE_KEYS.IMAGES);
      
      // Update the image URL
      onImageUploaded(localPath);
      
      // Close the dialog
      setIsDialogOpen(false);
      setImageSrc(null);
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Failed to save cropped image:', error);
      toast.error('Failed to process image');
    } finally {
      setIsLoading(false);
    }
  }, [completedCrop, imageFile, onImageUploaded]);

  const cancelCrop = useCallback(() => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
    setIsDialogOpen(false);
    setImageFile(null);
    setImageSrc(null);
  }, [imageSrc]);

  return (
    <>
      <div 
        className={`relative overflow-hidden rounded-lg mb-4 ${
          isDragging ? 'border-2 border-dashed border-primary' : 'border-2 border-dashed border-muted-foreground'
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div 
          className="flex flex-col items-center justify-center p-8 cursor-pointer"
        >
          <ImagePlus className="mb-2 text-muted-foreground" size={32} />
          <p className="text-sm text-muted-foreground text-center">
            Click or drag & drop to upload image
          </p>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-screen-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CropIcon size={18} />
              Crop Project Image
            </DialogTitle>
          </DialogHeader>
          
          <div className="my-4 max-h-[60vh] overflow-auto">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Preview"
                  onLoad={onImageLoad}
                  className="max-w-full"
                  style={{ 
                    maxHeight: '60vh',
                    maxWidth: '100%'
                  }}
                />
              </ReactCrop>
            )}
          </div>
          
          <DialogFooter>
            <NeumorphicButton
              size="sm"
              variant="secondary"
              onClick={cancelCrop}
              disabled={isLoading}
              className="px-4"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </NeumorphicButton>
            
            <NeumorphicButton
              size="sm"
              onClick={saveCroppedImage}
              disabled={isLoading || !completedCrop}
              className="px-4"
            >
              {isLoading ? 'Processing...' : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </NeumorphicButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Helper function to get tag name regardless of tag format (string or object)
const getTagName = (tag: string | Tag): string => {
  if (typeof tag === 'string') {
    return tag;
  }
  return tag.name;
};

// Helper function to handle tag comparison (either by string value or object id)
const isSameTag = (tag1: string | Tag, tag2: string | Tag): boolean => {
  if (typeof tag1 === 'string' && typeof tag2 === 'string') {
    return tag1 === tag2;
  }
  if (typeof tag1 === 'object' && typeof tag2 === 'object') {
    return tag1.id === tag2.id;
  }
  if (typeof tag1 === 'string' && typeof tag2 === 'object') {
    return tag1 === tag2.name;
  }
  if (typeof tag1 === 'object' && typeof tag2 === 'string') {
    return tag1.name === tag2;
  }
  return false;
};

const ProjectEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id !== undefined && id !== 'new';

  const emptyProject: Project = {
    id: Date.now(),
    title: "",
    description: "",
    image: "/placeholder.svg",
    tags: [],
    link: "",
    fullDescription: "",
    images: ["/placeholder.svg"]
  };

  const [project, setProject] = useState<Project>(emptyProject);
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!isEditMode) return;
      
      try {
        setIsLoading(true);
        const projectData = await ProjectService.getProjectById(Number(id));
        setProject({
          ...projectData,
          images: projectData.images || [projectData.image]
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project data.');
        toast.error("Project not found");
        navigate('/admin/projects');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [id, isEditMode, navigate]);

  const handleSave = async () => {
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

    const updatedProject = {
      ...project,
      image: project.images[0]
    };

    setIsSaving(true);
    try {
      if (isEditMode) {
        await ProjectService.updateProject(Number(id), updatedProject);
        toast.success("Project updated successfully");
      } else {
        await ProjectService.createProject(updatedProject);
        toast.success("Project created successfully");
      }
      navigate('/admin/projects');
    } catch (err) {
      console.error('Error saving project:', err);
      toast.error("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/projects');
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      // Check if the tag already exists
      const tagExists = project.tags.some(tag => 
        typeof tag === 'string' 
          ? tag === newTag.trim() 
          : tag.name === newTag.trim()
      );
      
      if (!tagExists) {
        // Convert existing tags to strings if they're objects
        const currentTags = project.tags.map(tag => 
          typeof tag === 'string' ? tag : tag.name
        );
        
        setProject({
          ...project,
          tags: [...currentTags, newTag.trim()] as string[]
        });
        setNewTag("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string | Tag) => {
    const tagNameToRemove = typeof tagToRemove === 'string' 
      ? tagToRemove 
      : tagToRemove.name;
    
    // Convert all tags to strings for consistent handling
    const updatedTags = project.tags
      .filter(tag => {
        const currentTagName = typeof tag === 'string' ? tag : tag.name;
        return currentTagName !== tagNameToRemove;
      })
      .map(tag => typeof tag === 'string' ? tag : tag.name);
    
    setProject({
      ...project,
      tags: updatedTags as string[]
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...(project.images || [])];
    newImages.splice(index, 1);
    
    setProject({
      ...project,
      images: newImages.length > 0 ? newImages : ["/placeholder.svg"]
    });
  };

  const handleSetMainImage = (index: number) => {
    if (!project.images) return;
    
    const newImages = [...project.images];
    const [selectedImage] = newImages.splice(index, 1);
    newImages.unshift(selectedImage);
    
    setProject({
      ...project,
      images: newImages,
      image: selectedImage
    });
    
    toast.success("Main image updated");
  };

  return (
    <div className="container py-8 mx-auto">
      <div className="flex items-center mb-6">
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
                className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                placeholder="Brief description of your project"
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-foreground mb-2 font-medium">Project URL</label>
              <input
                type="url"
                className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                placeholder="https://your-project-url.com"
                value={project.link}
                onChange={(e) => setProject({ ...project, link: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-foreground mb-2 font-medium">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.tags.map(tag => (
                  <div 
                    key={typeof tag === 'string' ? tag : tag.id} 
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed"
                  >
                    {getTagName(tag)}
                    <button 
                      type="button"
                      className="ml-1 text-muted-foreground hover:text-primary"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-grow p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                  placeholder="Add technology tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <NeumorphicButton 
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add
                </NeumorphicButton>
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

            <div>
              <label className="block text-foreground mb-2 font-medium">Project Images</label>
              <p className="text-muted-foreground text-sm mb-3">
                The first image will be used as the main project thumbnail. Click "Set as Main" to reorder.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {project.images && project.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className={`h-24 w-full bg-muted rounded-lg overflow-hidden ${index === 0 ? 'ring-2 ring-primary' : ''}`}>
                      <LocalImage 
                        src={image} 
                        alt={`Project image ${index + 1}`}
                        className="w-full h-full object-cover"
                        fallbackSrc={DEFAULT_IMAGE}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(index)}
                          className="p-1.5 bg-background rounded-full text-foreground"
                          title="Set as main image"
                        >
                          <FileImage size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 bg-background rounded-full text-destructive"
                        title="Remove image"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                    {index === 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs py-0.5 px-2 rounded-full">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <ImageUploader onImageUploaded={(url) => {
                setProject({
                  ...project,
                  images: [...(project.images || []), url]
                });
                toast.success('Image added to project');
              }} />
            </div>

            <div className="flex justify-end mt-8 space-x-4">
              <NeumorphicButton 
                variant="secondary" 
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </NeumorphicButton>
              <NeumorphicButton 
                onClick={handleSave}
                className="flex items-center gap-2"
                disabled={isSaving}
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save Project'}
              </NeumorphicButton>
            </div>
          </div>
        </NeumorphicCard>
      )}
    </div>
  );
};

export default ProjectEditor;
