import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NeumorphicButton from '../ui/NeumorphicButton';
import NeumorphicCard from '../ui/NeumorphicCard';
import { ArrowRight } from 'lucide-react';
import { HomeService } from '@/lib/apiService';
import { HomePage } from '@/data/homeData';
import LocalImage from '@/components/ui/LocalImage';

const Hero = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<HomePage['hero']>({
    title: "",
    subtitle: "",
    profession: "",
    profileImage: undefined,
    services: []
  });

  // Fetch hero data when component mounts
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setIsLoading(true);
        const data = await HomeService.getHomeContent();
        setHeroData(data.hero);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Show skeleton loading state
  if (isLoading) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-pulse">
            <div className="mb-6">
              <div className="h-8 w-40 bg-neu-pressed rounded-full mb-4"></div>
              <div className="h-16 bg-neu-pressed rounded mb-4"></div>
              <div className="h-10 w-3/4 bg-neu-pressed rounded mb-6"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-36 bg-neu-pressed rounded"></div>
              <div className="h-12 w-36 bg-neu-pressed rounded"></div>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 bg-neu-pressed rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 animate-slide-up">
          <div className="mb-6">
            <div className="inline-block py-1 px-3 rounded-full text-sm mb-2 neu-flat">
              <span className="text-neu-accent font-medium">{heroData.profession}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              {heroData.title}
            </h1>
            <p className="text-xl sm:text-2xl text-neu-text-secondary mb-6">
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
          <NeumorphicCard variant="convex" className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden">
            {heroData.profileImage ? (
              <LocalImage 
                src={heroData.profileImage} 
                alt={heroData.title} 
                className="w-full h-full object-cover"
                isProfileImage={true}
                fallbackSrc="https://placehold.co/800/333/fff?text=Photo"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                <span className="text-lg">Your Photo</span>
              </div>
            )}
          </NeumorphicCard>
        </div>
      </div>
      
      <div className="w-full max-w-4xl mx-auto mt-20 md:mt-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        {heroData.services.map((service) => (
          <NeumorphicCard key={service.id}>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-neu-text-secondary">{service.description}</p>
          </NeumorphicCard>
        ))}
      </div>
    </section>
  );
};

export default Hero;
