import React, { useState, useEffect } from 'react';
import ProjectCard from '@/components/projects/ProjectCard';
import { ProjectService } from '@/lib/apiService';
import { Project } from '@/data/projectData';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await ProjectService.getAllProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <main className="page-transition py-20 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl font-bold mb-4 text-foreground">My Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Here's a selection of my recent work. Each project represents a unique challenge and solution.
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.id}
                className="animate-fade-in"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Projects;
