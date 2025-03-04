import React from 'react';
import NeumorphicCard from '../ui/NeumorphicCard';
import { Briefcase, GraduationCap, Award, Heart } from 'lucide-react';

const AboutMe = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl font-bold mb-4 text-foreground">About Me</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            I'm a passionate developer with a keen eye for design and a love for creating intuitive, beautiful digital experiences.
          </p>
        </div>
        
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <NeumorphicCard className="p-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">My Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                With over 5 years of experience in web development, I've had the opportunity to work on a diverse range of projects, from small business websites to complex web applications for enterprise clients.
              </p>
              <p>
                My approach to development is centered around the user experience. I believe that great software should not only function flawlessly but also provide an intuitive and enjoyable experience for the end user.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying outdoor activities to recharge my creative energy.
              </p>
            </div>
          </NeumorphicCard>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <NeumorphicCard className="h-full">
              <div className="flex items-start mb-4">
                <div className="p-3 neu-pressed dark:shadow-dark-neu-pressed rounded-lg mr-4">
                  <Briefcase className="text-primary" size={24} />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Work Experience</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Senior Frontend Developer</h3>
                  <p className="text-primary mb-1">Tech Solutions Inc.</p>
                  <p className="text-sm text-muted-foreground mb-2">2020 - Present</p>
                  <p className="text-muted-foreground">
                    Leading frontend development for enterprise clients, focusing on React applications with TypeScript.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">UI/UX Developer</h3>
                  <p className="text-primary mb-1">Creative Agency</p>
                  <p className="text-sm text-muted-foreground mb-2">2017 - 2020</p>
                  <p className="text-muted-foreground">
                    Designed and developed responsive websites and interactive prototypes.
                  </p>
                </div>
              </div>
            </NeumorphicCard>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <NeumorphicCard className="h-full">
              <div className="flex items-start mb-4">
                <div className="p-3 neu-pressed dark:shadow-dark-neu-pressed rounded-lg mr-4">
                  <GraduationCap className="text-primary" size={24} />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Education</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Master of Computer Science</h3>
                  <p className="text-primary mb-1">University of Technology</p>
                  <p className="text-sm text-muted-foreground mb-2">2015 - 2017</p>
                  <p className="text-muted-foreground">
                    Specialized in Human-Computer Interaction and User Interface Design.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">Bachelor of Software Engineering</h3>
                  <p className="text-primary mb-1">State University</p>
                  <p className="text-sm text-muted-foreground mb-2">2011 - 2015</p>
                  <p className="text-muted-foreground">
                    Foundation in programming, software design, and development methodologies.
                  </p>
                </div>
              </div>
            </NeumorphicCard>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <NeumorphicCard className="h-full">
            <div className="flex items-start mb-4">
              <div className="p-3 neu-pressed dark:shadow-dark-neu-pressed rounded-lg mr-4">
                <Award className="text-primary" size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Skills</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-foreground">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Next.js', 'HTML/CSS', 'JavaScript', 'Node.js', 'Git', 'TailwindCSS'].map((skill) => (
                    <span key={skill} className="inline-block py-1 px-3 neu-flat dark:shadow-dark-neu-flat rounded-full text-sm text-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-foreground">Design Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {['UI/UX Design', 'Figma', 'Responsive Design', 'Design Systems', 'Wireframing'].map((skill) => (
                    <span key={skill} className="inline-block py-1 px-3 neu-flat dark:shadow-dark-neu-flat rounded-full text-sm text-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </NeumorphicCard>
          
          <NeumorphicCard className="h-full">
            <div className="flex items-start mb-4">
              <div className="p-3 neu-pressed dark:shadow-dark-neu-pressed rounded-lg mr-4">
                <Heart className="text-primary" size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Personal Values</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">User-Centered Design:</span> I believe in putting the user first in all design and development decisions.
              </p>
              <p>
                <span className="font-medium text-foreground">Continuous Learning:</span> Technology evolves rapidly, and I'm committed to always learning and improving.
              </p>
              <p>
                <span className="font-medium text-foreground">Attention to Detail:</span> The small details often make the biggest difference in user experience.
              </p>
              <p>
                <span className="font-medium text-foreground">Collaboration:</span> Great products are built by great teams working together.
              </p>
            </div>
          </NeumorphicCard>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
