
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NeumorphicButton from '../ui/NeumorphicButton';
import NeumorphicCard from '../ui/NeumorphicCard';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 animate-slide-up">
          <div className="mb-6">
            <div className="inline-block py-1 px-3 rounded-full text-sm mb-2 neu-flat">
              <span className="text-neu-accent font-medium">Frontend Developer</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              John Doe
            </h1>
            <p className="text-xl sm:text-2xl text-neu-text-secondary mb-6">
              Creating beautiful digital experiences with attention to detail
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
            <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
              <span className="text-lg">Your Photo</span>
            </div>
          </NeumorphicCard>
        </div>
      </div>
      
      <div className="w-full max-w-4xl mx-auto mt-20 md:mt-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <NeumorphicCard>
          <h3 className="text-xl font-semibold mb-2">UI/UX Design</h3>
          <p className="text-neu-text-secondary">Creating intuitive and beautiful user interfaces.</p>
        </NeumorphicCard>
        
        <NeumorphicCard>
          <h3 className="text-xl font-semibold mb-2">Web Development</h3>
          <p className="text-neu-text-secondary">Building responsive and performant websites.</p>
        </NeumorphicCard>
        
        <NeumorphicCard>
          <h3 className="text-xl font-semibold mb-2">Mobile Apps</h3>
          <p className="text-neu-text-secondary">Developing cross-platform mobile experiences.</p>
        </NeumorphicCard>
      </div>
    </section>
  );
};

export default Hero;
