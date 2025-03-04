
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { Save, Image, Trash } from 'lucide-react';

interface HeroContent {
  title: string;
  subtitle: string;
  profession: string;
  services: {
    id: string;
    title: string;
    description: string;
  }[];
}

const HomeEditor = () => {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "John Doe",
    subtitle: "Creating beautiful digital experiences with attention to detail",
    profession: "Frontend Developer",
    services: [
      {
        id: "1",
        title: "UI/UX Design",
        description: "Creating intuitive and beautiful user interfaces."
      },
      {
        id: "2",
        title: "Web Development",
        description: "Building responsive and performant websites."
      },
      {
        id: "3",
        title: "Mobile Apps",
        description: "Developing cross-platform mobile experiences."
      }
    ]
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

  // This effect would typically fetch the current hero content from an API
  useEffect(() => {
    // In a real implementation, we would fetch the content from an API
    // For now, we're using the initial state defined above
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, we would upload the file to a server
      // For now, we'll just create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      toast.success("Image uploaded successfully");
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    toast.success("Image removed");
  };

  const handleSave = () => {
    // In a real implementation, we would save the content to an API
    console.log("Saving content:", heroContent);
    toast.success("Home page content saved successfully");
  };

  return (
    <div className="container py-12 mx-auto page-transition">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neu-accent">Home Page Editor</h1>
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
                      />
                    </div>
                    
                    <div>
                      <label className="block text-neu-text-secondary mb-2">Service Description</label>
                      <textarea 
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg neu-pressed min-h-[80px]"
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
              <div className="w-64 h-64 rounded-full overflow-hidden neu-pressed mb-4 flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-neu-text-secondary text-center">
                    <Image size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No image selected</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <label className="cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <NeumorphicButton 
                    type="button" 
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Image size={16} />
                    Upload Image
                  </NeumorphicButton>
                </label>
                
                {profileImage && (
                  <NeumorphicButton 
                    type="button" 
                    size="sm"
                    variant="secondary"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-2 text-red-500"
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
