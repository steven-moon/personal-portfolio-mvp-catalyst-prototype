import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from "sonner";
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { Save, Image, Trash, Upload } from 'lucide-react';
import { HomeService } from '@/lib/apiService';
import { HomePage } from '@/data/homeData';
import LocalImage from '@/components/ui/LocalImage';
import { clearProfileImage } from '@/lib/localStorageUtils';

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

  // Fetch the current hero content from the API
  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        setIsLoading(true);
        const data = await HomeService.getHomeContent();
        setHeroContent({
          title: data.hero.title,
          subtitle: data.hero.subtitle,
          profession: data.hero.profession,
          services: data.hero.services || []
        });
        
        if (data.hero.profileImage) {
          setProfileImage(data.hero.profileImage);
        }
      } catch (error) {
        console.error('Error fetching home content:', error);
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
  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    console.log("File selected:", file.name);
    
    try {
      setIsLoading(true);
      
      // First set a local preview for immediate feedback
      const localPreviewUrl = URL.createObjectURL(file);
      setProfileImage(localPreviewUrl);
      
      // Then upload to the API
      const serverImageUrl = await HomeService.uploadProfileImage(file);
      console.log("Upload successful, server URL:", serverImageUrl);
      
      // Update with the server URL
      setProfileImage(serverImageUrl);
      toast.success("Image uploaded successfully");
      
      // Clean up the local URL
      URL.revokeObjectURL(localPreviewUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsLoading(false);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

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
    
    try {
      setIsLoading(true);
      
      // First set a local preview for immediate feedback
      const localPreviewUrl = URL.createObjectURL(file);
      setProfileImage(localPreviewUrl);
      
      // Then upload to the API
      const serverImageUrl = await HomeService.uploadProfileImage(file);
      console.log("Upload successful, server URL:", serverImageUrl);
      
      // Update with the server URL
      setProfileImage(serverImageUrl);
      toast.success("Image uploaded successfully");
      
      // Clean up the local URL
      URL.revokeObjectURL(localPreviewUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsLoading(false);
    }
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
      // Prepare the data to save
      const homeData: HomePage = {
        hero: {
          ...heroContent,
          profileImage: profileImage || undefined
        }
      };
      
      // Save to the API
      await HomeService.updateHomeContent(homeData);
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
    <div className="container py-12 mx-auto page-transition">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neu-accent">Home Page Editor</h1>
        <NeumorphicButton 
          onClick={handleSave}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </NeumorphicButton>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <NeumorphicCard className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-neu-text-secondary mb-2">Name / Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={heroContent.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg neu-pressed"
                />
              </div>
              
              <div>
                <label className="block text-neu-text-secondary mb-2">Profession</label>
                <input 
                  type="text" 
                  name="profession"
                  value={heroContent.profession}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg neu-pressed"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-neu-text-secondary mb-2">Subtitle / Tagline</label>
              <input 
                type="text" 
                name="subtitle"
                value={heroContent.subtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg neu-pressed"
              />
            </div>
          </NeumorphicCard>
          
          <NeumorphicCard>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Services Section</h2>
              <NeumorphicButton 
                variant="secondary" 
                onClick={handleAddService}
                size="sm"
                disabled={isLoading}
              >
                Add Service
              </NeumorphicButton>
            </div>
            
            <div className="space-y-6">
              {heroContent.services.map((service, index) => (
                <div key={service.id} className="neu-flat p-4 relative">
                  <button 
                    onClick={() => handleRemoveService(index)}
                    className="absolute top-2 right-2 p-2 rounded-full hover:bg-red-100 text-red-500"
                    disabled={isLoading}
                  >
                    <Trash size={16} />
                  </button>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-neu-text-secondary mb-2">Service Title</label>
                      <input 
                        type="text" 
                        value={service.title}
                        onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg neu-pressed"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-neu-text-secondary mb-2">Service Description</label>
                      <textarea 
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg neu-pressed min-h-[80px]"
                        disabled={isLoading}
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
            <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
            
            <div className="flex flex-col items-center">
              <div 
                className={`w-64 h-64 rounded-full overflow-hidden neu-pressed mb-4 flex items-center justify-center relative cursor-pointer ${isDragging ? 'border-4 border-dashed border-neu-accent bg-neu-accent/10' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                {profileImage ? (
                  <LocalImage 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                    isProfileImage={true}
                    fallbackSrc="https://placehold.co/500x500/333/fff?text=Profile"
                  />
                ) : (
                  <div className="text-neu-text-secondary text-center p-4 pointer-events-none">
                    <Upload size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Drop image here or click to upload</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                {/* Hidden file input */}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  ref={fileInputRef}
                />
                
                {/* Upload button */}
                <NeumorphicButton 
                  type="button" 
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={isLoading}
                  onClick={triggerFileInput}
                >
                  <Image size={16} />
                  Upload Image
                </NeumorphicButton>
                
                {/* Remove button - only shown when an image exists */}
                {profileImage && (
                  <NeumorphicButton 
                    type="button" 
                    size="sm"
                    variant="secondary"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-2 text-red-500"
                    disabled={isLoading}
                  >
                    <Trash size={16} />
                    Remove
                  </NeumorphicButton>
                )}
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium mb-2">Image Guidelines</h3>
              <ul className="text-neu-text-secondary space-y-1 text-sm">
                <li>• Use a high-quality professional photo</li>
                <li>• Recommended size: 500x500 pixels</li>
                <li>• Square aspect ratio works best</li>
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
