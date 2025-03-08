import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NeumorphicButton from '../ui/NeumorphicButton';
import NeumorphicCard from '../ui/NeumorphicCard';
import { ArrowRight } from 'lucide-react';
import { HomeService } from '@/lib/apiService';
import { HomePage } from '@/data/homeData';
import LocalImage from '@/components/ui/LocalImage';
import { toast } from 'sonner';
import { User } from 'lucide-react';

// Default profile image URL for when no image is provided
const DEFAULT_PROFILE_IMAGE = "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&auto=format";

// Interface to match the backend response structure
interface BackendHomePage {
  id: number;
  title: string;
  subtitle: string;
  profession: string;
  profileImage?: string;
  services: {
    id: number | string;
    title: string;
    description: string;
  }[];
}

const Hero = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroData, setHeroData] = useState<HomePage['hero']>({
    title: "",
    subtitle: "",
    profession: "",
    profileImage: "/images/sample-profile.png",
    services: []
  });

  // Fetch hero data when component mounts
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Hero: Fetching home content...');
        
        // Get home page content using the HomeService, which will try the real API first
        // and fall back to mock data if necessary
        const data = await HomeService.getHomeContent();
        
        console.log('Hero: API response received:', data);
        console.log('Hero: Response type:', typeof data);
        console.log('Hero: Response has id property?', 'id' in data);
        console.log('Hero: Response has services property?', 'services' in data);
        console.log('Hero: Response has hero property?', 'hero' in data);
        
        // Determine if this is mock data by checking if useMockApi is true
        // We can't rely solely on the data structure to determine if it's mock data
        // since the real API can also return data with a hero property
        const isMockApi = import.meta.env.VITE_USE_MOCK_DATA === 'true';
        console.log('Hero: Is using mock API according to env?', isMockApi);
        
        if ('id' in data && !('hero' in data)) {
          // Backend API format 1: data with id at root level
          console.log('Hero: Detected backend API format (with root id)');
          // Backend API data structure
          const backendData = data as unknown as BackendHomePage;
          console.log('Hero: Backend data:', backendData);
          
          // Check if services exist and are populated
          if (backendData.services && Array.isArray(backendData.services)) {
            console.log('Hero: Backend services found:', backendData.services);
          } else {
            console.log('Hero: No services found in backend data');
          }
          
          // Transform the data to match our frontend structure
          const transformedData = {
            title: backendData.title || "",
            subtitle: backendData.subtitle || "",
            profession: backendData.profession || "",
            profileImage: backendData.profileImage || "/images/sample-profile.png",
            services: Array.isArray(backendData.services) 
              ? backendData.services.map(service => ({
                  id: service.id.toString(),
                  title: service.title || "",
                  description: service.description || ""
                }))
              : []
          };
          
          console.log('Hero: Transformed data:', transformedData);
          console.log('Hero: Transformed services count:', transformedData.services.length);
          
          setHeroData(transformedData);
        } else if ('hero' in data) {
          // This could be from either real API or mock API with hero property
          console.log('Hero: Detected response with hero property');
          
          if (isMockApi) {
            console.log('Hero: Processing as mock API data (based on env setting)');
            // Mock API data structure
            const mockData = (data as HomePage).hero;
            console.log('Hero: Mock data:', mockData);
            console.log('Hero: Mock services:', mockData.services);
            console.log('Hero: Mock services count:', mockData.services?.length || 0);
            
            setHeroData({
              ...mockData,
              // Ensure services is an array even if missing
              services: Array.isArray(mockData.services) ? mockData.services : []
            });
          } else {
            // Real API with hero property
            console.log('Hero: Processing as real API data with hero property');
            const apiData = (data as HomePage).hero;
            console.log('Hero: Real API data with hero:', apiData);
            console.log('Hero: Real API services:', apiData.services);
            console.log('Hero: Real API services count:', apiData.services?.length || 0);
            
            setHeroData({
              ...apiData,
              services: Array.isArray(apiData.services) ? apiData.services : []
            });
          }
        } else {
          console.log('Hero: Unknown data format, trying to adapt');
          // Try to adapt to whatever we received
          const adaptedData = {
            title: data.title || "",
            subtitle: data.subtitle || "",
            profession: data.profession || "",
            profileImage: data.profileImage || "/images/sample-profile.png",
            services: Array.isArray(data.services) 
              ? data.services.map((service: any) => ({
                  id: (service.id || Math.random().toString(36)).toString(),
                  title: service.title || "",
                  description: service.description || ""
                }))
              : []
          };
          
          console.log('Hero: Adapted data:', adaptedData);
          setHeroData(adaptedData);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
        setError('Failed to load page content. Please try refreshing.');
        toast.error('Failed to load page content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Log when heroData changes
  useEffect(() => {
    console.log('Hero: heroData updated:', heroData);
    console.log('Hero: services in state:', heroData.services);
    console.log('Hero: services count in state:', heroData.services?.length || 0);
  }, [heroData]);

  // Show skeleton loading state
  if (isLoading) {
    return (
      <section className="flex flex-col px-6 pt-4 pb-8 bg-background">
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-pulse">
            <div className="mb-6">
              <div className="h-8 w-40 bg-neu-pressed dark:bg-zinc-700 rounded-full mb-4"></div>
              <div className="h-16 bg-neu-pressed dark:bg-zinc-700 rounded mb-4"></div>
              <div className="h-10 w-3/4 bg-neu-pressed dark:bg-zinc-700 rounded mb-6"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-36 bg-neu-pressed dark:bg-zinc-700 rounded"></div>
              <div className="h-12 w-36 bg-neu-pressed dark:bg-zinc-700 rounded"></div>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 bg-neu-pressed dark:bg-zinc-700 rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="flex flex-col items-center justify-center px-6 py-20 bg-background">
        <NeumorphicCard className="max-w-md p-6">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Content</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <NeumorphicButton onClick={() => window.location.reload()}>
            Refresh Page
          </NeumorphicButton>
        </NeumorphicCard>
      </section>
    );
  }

  // Log right before render
  console.log('Hero: Rendering with services:', heroData.services?.length || 0);
  
  // Ensure services is an array before rendering
  const services = Array.isArray(heroData.services) ? heroData.services : [];

  return (
    <section className="flex flex-col px-6 pt-4 pb-8 bg-background">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 animate-slide-up">
          <div className="mb-6">
            <div className="inline-block py-1 px-3 rounded-full text-sm mb-2 neu-flat dark:shadow-dark-neu-flat">
              <span className="text-primary font-medium">{heroData.profession}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-foreground">
              {heroData.title}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-6">
              {heroData.subtitle}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <NeumorphicButton 
              size="lg"
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2"
            >
              View My Work
              <ArrowRight size={18} />
            </NeumorphicButton>
            
            <NeumorphicButton 
              variant="secondary"
              size="lg"
              onClick={() => navigate('/contact')}
            >
              Get In Touch
            </NeumorphicButton>
          </div>
        </div>
        
        <div className="order-1 md:order-2 flex justify-center animate-slide-in-right">
          <NeumorphicCard 
            variant="convex" 
            className="w-64 h-64 sm:w-80 sm:h-80 rounded-lg overflow-hidden flex items-center justify-center p-0"
            style={{ padding: 0 }}
          >
            <div className="w-full h-full overflow-hidden flex items-center justify-center bg-background p-3">
              <div className="w-full h-full overflow-hidden">
                {heroData.profileImage ? (
                  <LocalImage 
                    src={heroData.profileImage} 
                    alt={heroData.title}
                    isProfileImage={true}
                    className="w-full h-full"
                  />
                ) : (
                  <User 
                    className="w-32 h-32 opacity-30" 
                  />
                )}
              </div>
            </div>
          </NeumorphicCard>
        </div>
      </div>
      
      <div className="w-full max-w-4xl mx-auto mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        {services.length > 0 ? (
          services.map((service) => (
            <NeumorphicCard key={service.id}>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </NeumorphicCard>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-muted-foreground">No services available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
