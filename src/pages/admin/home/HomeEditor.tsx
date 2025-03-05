import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from "sonner";
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { Save, Image, Trash, Upload, Plus, Crop } from 'lucide-react';
import { HomeService } from '@/lib/apiService';
import { HomePage } from '@/data/homeData';
import LocalImage from '@/components/ui/LocalImage';
import { clearProfileImage } from '@/lib/localStorageUtils';
import ImageCropper from '@/components/ui/ImageCropper';

const HomeEditor = () => {
  const [heroContent, setHeroContent] = useState<HomePage['hero']>({
    title: "",
    subtitle: "",
    profession: "",
    services: []
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add state for image cropper
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);

  // Fetch the current hero content from the API
  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        setIsLoading(true);
        const data = await HomeService.getHomeContent();
        console.log('HomeEditor: Received home content:', data);
        
        // Make sure we have a valid services array
        const services = data.hero?.services || [];
        console.log('HomeEditor: Services loaded:', services);
        
        // Handle legacy data format if needed
        if (!Array.isArray(services)) {
          console.error('HomeEditor: Services is not an array, resetting to empty array');
          data.hero.services = [];
        }
        
        // Set the state with the fetched data, providing defaults if needed
        setHeroContent({
          title: data.hero?.title || '',
          subtitle: data.hero?.subtitle || '',
          profession: data.hero?.profession || '',
          services: Array.isArray(data.hero?.services) ? data.hero.services : []
        });
        
        if (data.hero?.profileImage) {
          setProfileImage(data.hero.profileImage);
        }
      } catch (error) {
        console.error('Error fetching home content:', error);
        // Set default values on error
        setHeroContent({
          title: '',
          subtitle: '',
          profession: '',
          services: []
        });
        toast.error('Failed to load home page content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeContent();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHeroContent(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (index: number, field: 'title' | 'description', value: string) => {
    setHeroContent(prev => {
      const updatedServices = [...prev.services];
      updatedServices[index] = { 
        ...updatedServices[index], 
        [field]: value 
      };
      return { ...prev, services: updatedServices };
    });
  };

  const handleAddService = () => {
    if (heroContent.services.length >= 6) {
      toast.warning("You can have a maximum of 6 services");
      return;
    }
    
    setHeroContent(prev => ({
      ...prev,
      services: [
        ...prev.services,
        {
          id: Date.now().toString(),
          title: "New Service",
          description: "Description of your new service"
        }
      ]
    }));
  };

  const handleRemoveService = (index: number) => {
    if (heroContent.services.length <= 1) {
      toast.warning("You need at least one service");
      return;
    }
    
    setHeroContent(prev => {
      const updatedServices = [...prev.services];
      updatedServices.splice(index, 1);
      return { ...prev, services: updatedServices };
    });
  };

  // Handle file input change (when user selects a file)
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    console.log("File selected:", file.name);
    
    // Create a URL for the selected file
    const localPreviewUrl = URL.createObjectURL(file);
    
    // Store the temp image and show cropper instead of uploading directly
    setTempImageSrc(localPreviewUrl);
    setShowCropper(true);
    
    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // Handle the cropped image from the ImageCropper component
  const handleCroppedImage = async (dataUrl: string) => {
    const validateImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Create an image element to check dimensions
        const img = document.createElement('img');
        img.onload = () => {
          if (img.width > 0 && img.height > 0) {
            console.log(`Validated image dimensions: ${img.width}x${img.height}`);
            resolve();
          } else {
            reject(new Error("Invalid image dimensions"));
          }
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = src;
      });
    };

    try {
      setIsLoading(true);
      
      // Verify the data URL is valid
      if (!dataUrl || !dataUrl.startsWith('data:image/')) {
        throw new Error("Invalid image data");
      }
      
      console.log(`Processing cropped image data URL length: ${dataUrl.length}`);
      
      try {
        // Validate the data URL
        await validateImage(dataUrl);
        console.log("Image validation successful");
      } catch (validationError) {
        console.error("Image validation failed:", validationError);
        throw validationError;
      }
      
      // Convert data URL to blob for upload
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Convert blob to File object for upload
      const croppedFile = new File([blob], 'cropped-profile.jpg', { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      // Set the preview image - use data URL directly
      setProfileImage(dataUrl);
      
      try {
        // Upload the cropped image to the API
        const serverImageUrl = await HomeService.uploadProfileImage(croppedFile);
        console.log("Upload successful, server URL:", serverImageUrl);
        
        // Update with the server URL
        setProfileImage(serverImageUrl);
        toast.success("Image cropped and uploaded successfully");
      } catch (uploadError) {
        console.error("API upload failed:", uploadError);
        // Keep using the data URL since upload failed
        toast.error(`Failed to upload to server: ${uploadError.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Cropping process failed:", error);
      toast.error(`Failed to process cropped image: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Close cropper without saving
  const handleCloseCropper = useCallback(() => {
    if (tempImageSrc) {
      URL.revokeObjectURL(tempImageSrc);
      setTempImageSrc(null);
    }
    setShowCropper(false);
  }, [tempImageSrc]);

  // Trigger file input click
  const triggerFileInput = useCallback(() => {
    console.log("Triggering file input");
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

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    console.log("File dropped:", file.name, file.type);
    
    if (!file.type.startsWith('image/')) {
      toast.error("Please drop an image file");
      return;
    }
    
    // Create a URL for the dropped file and show cropper
    const localPreviewUrl = URL.createObjectURL(file);
    setTempImageSrc(localPreviewUrl);
    setShowCropper(true);
  }, []);
  
  const handleRemoveImage = useCallback(() => {
    // Clear the profile image from local storage
    clearProfileImage();
    // Update the UI state
    setProfileImage(null);
    toast.success("Image removed");
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      toast.info("Saving home page content...");
      
      // Make sure all services have valid IDs
      const servicesWithIds = heroContent.services.map(service => {
        if (!service.id) {
          return {
            ...service,
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9)
          };
        }
        return service;
      });
      
      // Update the local state with validated services
      const updatedHeroContent = {
        ...heroContent,
        services: servicesWithIds
      };
      setHeroContent(updatedHeroContent);
      
      // Prepare the data to save
      const homeData: HomePage = {
        hero: {
          ...updatedHeroContent,
          profileImage: profileImage || undefined
        }
      };
      
      console.log('HomeEditor: Saving home data:', homeData);
      
      // Save to the API
      const savedData = await HomeService.updateHomeContent(homeData);
      console.log('HomeEditor: Save response:', savedData);
      
      // Update the local state with the data from the server to ensure consistency
      if (savedData && savedData.hero) {
        setHeroContent({
          title: savedData.hero.title || heroContent.title,
          subtitle: savedData.hero.subtitle || heroContent.subtitle,
          profession: savedData.hero.profession || heroContent.profession,
          services: Array.isArray(savedData.hero.services) ? savedData.hero.services : heroContent.services
        });
        
        if (savedData.hero.profileImage) {
          setProfileImage(savedData.hero.profileImage);
        }
      }
      
      toast.success("Home page content saved successfully");
    } catch (error) {
      console.error('Error saving home content:', error);
      toast.error('Failed to save home page content');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && heroContent.services.length === 0) {
    return (
      <div className="container py-12 mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-neu-pressed w-1/3 rounded"></div>
          <div className="h-64 bg-neu-pressed rounded"></div>
          <div className="h-64 bg-neu-pressed rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 mx-auto page-transition bg-background">
      {/* Show the image cropper when needed */}
      {showCropper && tempImageSrc && (
        <ImageCropper
          open={showCropper}
          onClose={handleCloseCropper}
          imageSrc={tempImageSrc}
          onCropComplete={handleCroppedImage}
        />
      )}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Home Page Editor</h1>
        <NeumorphicButton 
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          <Save size={18} />
          Save Changes
        </NeumorphicButton>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <NeumorphicCard className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-foreground">Hero Content</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-muted-foreground mb-2">Professional Title</label>
                <input 
                  type="text" 
                  name="profession"
                  value={heroContent.profession}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed bg-transparent text-foreground"
                  placeholder="e.g., Frontend Developer"
                />
              </div>
              
              <div>
                <label className="block text-muted-foreground mb-2">Headline</label>
                <input 
                  type="text" 
                  name="title"
                  value={heroContent.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed bg-transparent text-foreground"
                  placeholder="e.g., Jane Doe"
                />
              </div>
              
              <div>
                <label className="block text-muted-foreground mb-2">Subheadline</label>
                <input 
                  type="text" 
                  name="subtitle"
                  value={heroContent.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed bg-transparent text-foreground"
                  placeholder="e.g., Building beautiful digital experiences"
                />
              </div>
            </div>
          </NeumorphicCard>
          
          <NeumorphicCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Services</h2>
              <NeumorphicButton 
                variant="secondary" 
                onClick={handleAddService}
                size="sm"
                className="flex items-center gap-2"
                disabled={heroContent.services.length >= 6}
              >
                <Plus size={16} />
                Add Service
              </NeumorphicButton>
            </div>
            
            <div className="space-y-6">
              {heroContent.services.map((service, index) => (
                <div key={service.id} className="neu-flat dark:shadow-dark-neu-flat p-4 rounded-lg relative">
                  <button 
                    onClick={() => handleRemoveService(index)}
                    className="absolute top-2 right-2 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
                    disabled={heroContent.services.length <= 1}
                  >
                    <Trash size={16} />
                  </button>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-muted-foreground mb-2">Service Title</label>
                      <input 
                        type="text" 
                        value={service.title}
                        onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed bg-transparent text-foreground"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-muted-foreground mb-2">Description</label>
                      <textarea 
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg neu-pressed dark:shadow-dark-neu-pressed bg-transparent text-foreground min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </NeumorphicCard>
        </div>
        
        <div>
          <NeumorphicCard>
            <h2 className="text-xl font-semibold mb-6 text-foreground">Profile Image</h2>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                <div className="flex items-center gap-2">
                  <Image size={20} />
                  Profile Image
                </div>
              </h2>
              
              <div 
                className={`
                  neu-pressed dark:dark-neu-pressed rounded-xl p-6 
                  ${isDragging ? 'border-2 border-dashed border-primary' : ''}
                `}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  {/* Profile image preview */}
                  <div className="relative w-48 h-48 flex-shrink-0">
                    <NeumorphicCard 
                      variant="convex" 
                      className="w-48 h-48 rounded-lg overflow-hidden flex items-center justify-center p-0"
                    >
                      <div className="w-full h-full overflow-hidden flex items-center justify-center bg-background p-3">
                        <div className="w-full h-full overflow-hidden">
                          {profileImage ? (
                            <LocalImage 
                              src={profileImage} 
                              alt="Profile"
                              isProfileImage={true}
                              className="w-full h-full"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                              <Image size={48} strokeWidth={1} className="mb-2 opacity-50" />
                              <p className="text-sm">No profile image set</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </NeumorphicCard>
                    
                    {/* Remove image button (only shown when an image is set) */}
                    {profileImage && (
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive/90 transition-colors"
                        title="Remove image"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>

                  {/* Upload controls */}
                  <div className="flex flex-col gap-4 items-center sm:items-start">
                    <div>
                      <h3 className="font-medium mb-2 text-foreground">Image Guidelines</h3>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        <li>• Use a high-quality professional photo</li>
                        <li>• Image will be cropped to a square</li>
                        <li>• Maximum file size: 2MB</li>
                        <li>• Supported formats: JPG, PNG, WebP</li>
                      </ul>
                    </div>

                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange}
                    />
                    
                    <NeumorphicButton 
                      onClick={triggerFileInput} 
                      disabled={isLoading} 
                      className="flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Crop className="animate-spin" size={16} />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload Image
                        </>
                      )}
                    </NeumorphicButton>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium mb-2">Image Guidelines</h3>
              <ul className="text-neu-text-secondary space-y-1 text-sm">
                <li>• Use a high-quality professional photo</li>
                <li>• Image will be cropped to a square</li>
                <li>• Maximum file size: 2MB</li>
                <li>• Supported formats: JPG, PNG, WebP</li>
              </ul>
            </div>
          </NeumorphicCard>
          
          <div className="mt-8">
            <NeumorphicCard>
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <p className="text-neu-text-secondary mb-4">
                Changes will be reflected on your home page after saving.
              </p>
              <NeumorphicButton 
                onClick={() => window.open('/', '_blank')}
                variant="secondary"
                className="w-full"
              >
                View Current Home Page
              </NeumorphicButton>
            </NeumorphicCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeEditor;
