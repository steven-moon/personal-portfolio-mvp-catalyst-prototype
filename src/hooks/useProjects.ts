import { useState, useEffect } from 'react';
import { Project } from '../data/projectData';
import { ProjectService } from '../lib/apiService';

interface UseProjectsOptions {
  tag?: string;
  initialLoading?: boolean;
}

export function useProjects(options: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(options.initialLoading ?? true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = async (tag?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = tag 
        ? await ProjectService.getProjectsByTag(tag)
        : await ProjectService.getAllProjects();
        
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to refetch projects
  const refetch = () => fetchProjects(options.tag);

  // Function to create a new project
  const createProject = async (project: Omit<Project, 'id'>) => {
    try {
      setLoading(true);
      const newProject = await ProjectService.createProject(project);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while creating the project'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to update a project
  const updateProject = async (id: number, project: Partial<Omit<Project, 'id'>>) => {
    try {
      setLoading(true);
      const updatedProject = await ProjectService.updateProject(id, project);
      setProjects(prev => 
        prev.map(p => p.id === id ? updatedProject : p)
      );
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while updating the project'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a project
  const deleteProject = async (id: number) => {
    try {
      setLoading(true);
      await ProjectService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while deleting the project'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch projects on mount or when tag changes
  useEffect(() => {
    fetchProjects(options.tag);
  }, [options.tag]);

  return {
    projects,
    loading,
    error,
    refetch,
    createProject,
    updateProject,
    deleteProject
  };
} 