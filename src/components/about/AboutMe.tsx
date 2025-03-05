import React, { useState, useEffect } from 'react';
import NeumorphicCard from '../ui/NeumorphicCard';
import { Briefcase, GraduationCap, Award, Heart } from 'lucide-react';
import { AboutService } from '@/lib/apiService';
import { AboutMeData } from '@/data/aboutData';

const AboutMe = () => {
  const [aboutData, setAboutData] = useState<AboutMeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        const data = await AboutService.getAboutContent();
        setAboutData(data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (isLoading || !aboutData) {
    return (
      <section className="py-8 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-neu-pressed dark:bg-zinc-700 w-1/3 rounded mx-auto"></div>
            <div className="h-64 bg-neu-pressed dark:bg-zinc-700 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-neu-pressed dark:bg-zinc-700 rounded"></div>
              <div className="h-96 bg-neu-pressed dark:bg-zinc-700 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-64 bg-neu-pressed dark:bg-zinc-700 rounded"></div>
              <div className="h-64 bg-neu-pressed dark:bg-zinc-700 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl font-bold mb-4 text-foreground">{aboutData.intro.headline}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {aboutData.intro.subheadline}
          </p>
        </div>
        
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <NeumorphicCard className="p-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">My Story</h2>
            <div className="space-y-4 text-muted-foreground">
              {aboutData.story.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
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
                {aboutData.workExperience.map((exp) => (
                  <div key={exp.id}>
                    <h3 className="text-lg font-medium text-foreground">{exp.title}</h3>
                    <p className="text-primary mb-1">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mb-2">{exp.period}</p>
                    <p className="text-muted-foreground">{exp.description}</p>
                  </div>
                ))}
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
                {aboutData.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-lg font-medium text-foreground">{edu.degree}</h3>
                    <p className="text-primary mb-1">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground mb-2">{edu.period}</p>
                    <p className="text-muted-foreground">{edu.description}</p>
                  </div>
                ))}
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
                  {aboutData.skills.technical.map((skill) => (
                    <span key={skill} className="inline-block py-1 px-3 neu-flat dark:shadow-dark-neu-flat rounded-full text-sm text-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-foreground">Design Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {aboutData.skills.design.map((skill) => (
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
              {aboutData.values.map((value) => (
                <p key={value.id}>
                  <span className="font-medium text-foreground">{value.title}:</span> {value.description}
                </p>
              ))}
            </div>
          </NeumorphicCard>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
