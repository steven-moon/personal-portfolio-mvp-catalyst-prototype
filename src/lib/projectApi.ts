import { Project } from '../data/projectData';
import { apiGet, apiPost, apiPut, apiDelete } from './api';

const PROJECT_ENDPOINT = '/api/projects';

/**
 * Fetch all projects
 */
export async function getAllProjects(): Promise<Project[]> {
  return apiGet<Project[]>(PROJECT_ENDPOINT);
}

/**
 * Fetch a single project by ID
 */
export async function getProjectById(id: number): Promise<Project> {
  return apiGet<Project>(`${PROJECT_ENDPOINT}/${id}`);
}

/**
 * Create a new project
 */
export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  return apiPost<Project, Omit<Project, 'id'>>(PROJECT_ENDPOINT, project);
}

/**
 * Update an existing project
 */
export async function updateProject(
  id: number,
  project: Partial<Omit<Project, 'id'>>
): Promise<Project> {
  return apiPut<Project, Partial<Omit<Project, 'id'>>>(`${PROJECT_ENDPOINT}/${id}`, project);
}

/**
 * Delete a project
 */
export async function deleteProject(id: number): Promise<void> {
  return apiDelete<void>(`${PROJECT_ENDPOINT}/${id}`);
}

/**
 * Filter projects by tag
 */
export async function getProjectsByTag(tag: string): Promise<Project[]> {
  return apiGet<Project[]>(`${PROJECT_ENDPOINT}/tag/${encodeURIComponent(tag)}`);
}

/**
 * Upload project images
 * This function handles the specific case of uploading images for a project
 */
export async function uploadProjectImages(
  projectId: number, 
  images: File[]
): Promise<string[]> {
  const formData = new FormData();
  
  images.forEach((image, index) => {
    formData.append(`image-${index}`, image);
  });

  const response = await fetch(`${PROJECT_ENDPOINT}/${projectId}/images`, {
    method: 'POST',
    body: formData,
    // No Content-Type header as it will be set automatically with boundary for FormData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Image upload failed with status ${response.status}`
    );
  }

  return response.json();
} 